let Queryable = require('./Queryable.js');
let Benchmark = require('benchmark');


let arr = [...new Array(100).keys()];
let isEven = n => n % 2 === 0;
let add3 = n => n + 3;
let sum = (x, y) => x + y;
Array.prototype.asQueryable = function () {
    return new Queryable(this)
};

function useRawLoop() {
    let result = 0;
    for (let i = 0; i < arr.length; ++i) {
        let n = arr[i];
        if (n % 2 === 0) {
            n += 3;
            result += n
        }
    }
    return result
}

function useLoop() {
    let result = 0;
    for (let n of arr) {
        if (isEven(n)) {
            n = add3(n);
            result = sum(result, n)
        }
    }
    return result
}

function useArray() {
    return arr.filter(isEven)
        .map(add3)
        .reduce(sum, 0)
}

function useLINQ() {
    return arr.asQueryable()
        .filter(isEven)
        .map(add3)
        .reduce(sum, 0)
}

let suite = new Benchmark.Suite;

suite.add('RawLoop', useRawLoop)
    .add('Loop', useLoop)
    .add('Array', useArray)
    .add('LINQ', useLINQ)
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({'async': true});
