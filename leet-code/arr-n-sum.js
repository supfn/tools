// 题目：求给定数组arr中n个数相加之和为sum的所有可能集合, 返回一个二维数组
/**
 * cur = arr[i]
 * n=1, cur === sum,  [[sum]]
 * n=2, cur + fn(arr.slice(i), 1 ,sum-cur) === sum
 * n=3, cur + fn(arr.slice(i),n-1, sum-cur)
 * ...
 */

/**
 *
 * @param arr {Array}
 * @param n {number}
 * @param sum {number}
 * @returns {[*][]}
 */
function fn(arr, n, sum) {
  // arr = arr.sort((a, b) => a - b).filter(val => val<=sum);
  // arr = arr.filter(val => val <= sum);
  let ret = [];
  if (n === 1 && arr.indexOf(sum) !== -1) {
    return [[sum]];
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    let cur = arr[i];
    let pre = fn(arr.slice(i + 1), n - 1, sum - cur);
    if (pre.length) {
      pre.forEach(a => a.unshift(cur));
      ret = ret.concat(pre);
    }
  }
  return ret;
}

console.time('fnTime');
let arr = [...Array(20).keys()].slice(1);
let n = 4;
let sum = 20;
let result = fn(arr, n, sum);
console.log(result, result.length);
console.timeEnd('fnTime');

