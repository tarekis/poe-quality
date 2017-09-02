function getAllArrayCombinations(a) {
    const fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    const all = [];
    for (var i = 2; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

function findSingleSubset(numbers, target) {
    const subsets = getAllArrayCombinations(numbers);
    return subsets.find(subset => subset.reduce((a,b) => a+b,0) === target);
}

module.exports = (numbers, target) => {
    let result = null;

    function __subsetSum(numbers, target, partial) {
        let s, n, remaining;

        partial = partial || [];
        s = partial.reduce((a, b) => a + b, 0);

        if (s > target || partial.length > 4) {
            return null
        };

        if (s === target && partial.length == 4) {
            if(!result) result = [];
            result.push(partial);
        }

        for (let i = 0; i < numbers.length; i++) {
            n = numbers[i];
            remaining = numbers.slice(i + 1);
            __subsetSum(remaining, target, partial.concat([n]));
        }

        return result;
    }

    const results = __subsetSum(numbers, target);

    return results ? results[0] : findSingleSubset(numbers, target);
}
