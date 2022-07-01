let Queryable = require('./queryable.js');


// Array.prototype.asQueryable = function () {
//     return new Queryable(this)
// };
//
// let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// for (let item of arr.asQueryable()) {
//     console.log(item)
// }


// let arr = [11, 22, 33, 44, 55, 66, 77, 88, 99];
// let qr1 = new Queryable(arr);
// let qr2 = qr1.map(item => item + 1).filter(item => item % 2 === 0);
// console.log(qr2);
// console.log(qr2.toArray());


// 相对Array.prototype 测试性能

console.time('Queryable');
console.log(
    new Queryable([... new Array(1000000).keys()])
        .map(v => v * 10)
        .map(v => v / 10)
        .map(v => v * 10)
        .map(v => v / 10)
        .filter(v => v % 2 === 0)
        .reduce((pre, cur) => pre + cur, 0)
);
console.timeEnd('Queryable');


console.time('native Array');
console.log(
    [... new Array(1000000).keys()]
        .map(v => v * 10)
        .map(v => v / 10)
        .map(v => v * 10)
        .map(v => v / 10)
        .filter(v => v % 2 === 0)
        .reduce((pre, cur) => pre + cur, 0)
);
console.timeEnd('native Array');
