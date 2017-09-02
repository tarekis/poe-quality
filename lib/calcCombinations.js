const subSetSum = require('./subSetSum');

const target = 40;

module.exports = qualityArray => {
    const qualityArrayCopy = qualityArray;
    const allResults = [];
    
    let result = true;
    while(result) {
        result = subSetSum(qualityArrayCopy, target);
        if (result) {
            allResults.push(result);
            result.map(quality => qualityArrayCopy.indexOf(quality)).forEach((_index, index) => {
                qualityArrayCopy.splice(_index - index, 1);
            });
        }
    }

    return allResults;
}
