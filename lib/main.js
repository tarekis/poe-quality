const getItems = require('./getItems'); 
const calcCombinations = require('./calcCombinations');
const ora = require('ora');
const colors = require('colors');

let parseWarnings = [];

const qualityMap = item => {
    const qualityProperty = item.properties.find(property => property.name === 'Quality');
    if (!qualityProperty) {
        const regexResult = item.typeLine.match(/[a-z,A-Z, ]{4,}/);
        let typeLine = item.typeLine;
        if (regexResult) {
            typeLine = regexResult[0];
        }
        parseWarnings.push('This item has no quality! ' + typeLine.blue);
        return 0;
    }
    return parseInt(qualityProperty.values[0][0], 10);
}
const combinationReducer = (accumulator, combination) => accumulator = accumulator.concat(combination);
const numericSorter = (a,b) => a - b;

const joinString = ', '
const spinnerConfig = {
    interval: 80,
    frames: [
        "⠋",
        "⠙",
        "⠹",
        "⠸",
        "⠼",
        "⠴",
        "⠦",
        "⠧",
        "⠇",
        "⠏"
    ]
};

let spinner = ora({
    text: 'Requesting your stash items.',
    spinner: spinnerConfig
}).start();

getItems().then(items => {
    spinner.stopAndPersist({
        symbol: '✔️ '
    });
    spinner = ora({
        text: 'Parsing found items.',
        spinner: spinnerConfig
    }).start();

    const flaskQualities = items.filter(item => /Flask/.test(item.typeLine)).map(qualityMap);
    const gemQualities = items.filter(item => /socket/.test(item.descrText)).map(qualityMap);
    const mapQualities = items.filter(item => /Map/.test(item.typeLine)).map(qualityMap);
    
    const flaskCombinations = calcCombinations(flaskQualities);
    const gemCombinations = calcCombinations(gemQualities);
    const mapCombinations = calcCombinations(mapQualities);

    spinner.stopAndPersist({
        symbol: '✔️ '
    });
    console.log('');
    parseWarnings.forEach(warning => {
        console.log('WARNING: '.yellow + warning);
        console.log('');
    })

    if (flaskCombinations.length > 0) {
        console.log(`✔️  Vendor flasks with those qualities for ${flaskCombinations.length} ` + 'Glassblower\'s Bauble'.green + ':');
        console.log('   ' + flaskCombinations.reduce(combinationReducer, []).sort(numericSorter).join(joinString));
    }

    if (gemCombinations.length > 0) {
        console.log('');
        console.log(`✔️  Vendor gems with those qualities for ${gemCombinations.length} ` + 'Gemcutter\'s Prism'.rainbow + ':');
        console.log('   ' + gemCombinations.reduce(combinationReducer, []).sort(numericSorter).join(joinString));
    }

    if (mapCombinations.length > 0) {
        console.log('');
        console.log(`✔️  Vendor maps with those qualities for  ${mapCombinations.length} ` + 'Cartographer\'s Chisel'.white + ':');
        console.log('   ' + mapCombinations.reduce(combinationReducer, []).sort(numericSorter).join(joinString));
    }

    if (flaskCombinations.length + gemCombinations.length + mapCombinations.length === 0) {
        console.log('❌  No combinations found!');
    }
})
.catch(error => {
    spinner.stopAndPersist({
        symbol: '❌ ',
        text: error
    });
});
