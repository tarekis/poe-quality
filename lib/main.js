const getItems = require('./getItems'); 
const calcCombinations = require('./calcCombinations');
const logCombinations = require('./logCombinations');
const ora = require('ora');
const colors = require('colors');

let parseWarnings = [];

const getQualities = items => {
    const qualities = [];
    items.forEach(item => {
        const qualityProperty = item.properties.find(property => property.name === 'Quality');
        if (!qualityProperty) {
            const regexResult = item.typeLine.match(/[a-z,A-Z, ]{4,}/);
            let typeLine = item.typeLine;
            if (regexResult) {
                typeLine = regexResult[0];
            }
            parseWarnings.push('This item has no quality! ' + typeLine.blue);
            return;
        }
        qualities.push(parseInt(qualityProperty.values[0][0], 10));
    });

    return qualities;
}

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

    const flaskQualities = getQualities(items.filter(item => /Flask/.test(item.typeLine)));
    const gemQualities = getQualities(items.filter(item => /socket/.test(item.descrText)));
    const mapQualities = getQualities(items.filter(item => /Map/.test(item.typeLine)));
    
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
        logCombinations(flaskCombinations);
    }

    if (gemCombinations.length > 0) {
        console.log('');
        console.log(`✔️  Vendor gems with those qualities for ${gemCombinations.length} ` + 'Gemcutter\'s Prism'.rainbow + ':');
        logCombinations(gemCombinations);
    }

    if (mapCombinations.length > 0) {
        console.log('');
        console.log(`✔️  Vendor maps with those qualities for  ${mapCombinations.length} ` + 'Cartographer\'s Chisel'.white + ':');
        logCombinations(mapCombinations);
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
