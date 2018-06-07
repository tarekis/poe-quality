const subSetSum = require('./subSetSum');
const clone = require('clone');

const target = 40;

module.exports = array => {
    const arrayCopy = clone(array);
    const allResults = [];
    
    let result = true;
    while(result) {
        result = subSetSum(arrayCopy, target);
        if (result) {
            allResults.push(result);
            result.forEach(quality => {
                arrayCopy.splice(arrayCopy.indexOf(quality), 1);

            });
        }
    }

    return allResults;
}
