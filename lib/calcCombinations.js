const subSetSum = require('./subSetSum');

const target = 40;

module.exports = array => {
    const arrayCopy = array;
    const allResults = [];
    
    let result = true;
    while(result) {
        result = subSetSum(arrayCopy, target);
        if (result) {
            allResults.push(result);
            result.map(quality => arrayCopy.indexOf(quality)).forEach((_index, index) => {
                arrayCopy.splice(_index - index, 1);
            });
        }
    }

    return allResults;
}
