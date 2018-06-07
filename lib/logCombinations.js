const colors = require('colors');

const combinationReducer = (accumulator, combination) => accumulator = accumulator.concat(combination);
const numericSorter = (a,b) => a - b;

module.exports = array => {
    const allQualities= array.reduce(combinationReducer, []).sort(numericSorter);
    const countObjectArray = [];
    allQualities.forEach(quality => {
        const foundCountObject = countObjectArray.find(countObject => countObject.quality === quality);
        if (foundCountObject) {
            foundCountObject.count++;
        } else {
            countObjectArray.push({
                count: 1,
                quality
            });
        }
    });
    countObjectArray.forEach(countObject => {
        console.log(countObject.count.toString().green + ' x ' + countObject.quality);
    })
}
