/*
返回所有长度为 n 且满足其每两个连续位上的数字之间的差的绝对值为 k 的 非负整数 。

请注意，除了 数字 0 本身之外，答案中的每个数字都 不能 有前导零。例如，01 有一个前导零，所以是无效的；但 0 是有效的。

你可以按 任何顺序 返回答案。

输入：n = 3, k = 7
输出：[181,292,707,818,929]
解释：注意，070 不是一个有效的数字，因为它有前导零。


输入：n = 2, k = 1
输出：[10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]
* */

/**
 * @param {number} n
 * @param {number} k
 * @return {number[]}
 */
let numsSameConsecDiff = function(n, k) {
  let ret = new Set([1,2,3,4,5,6,7,8,9]);
  for(let step = 1; step < n; step++){
    let ret2 = new Set();
    for(let val of ret){
      let last = val % 10;
      if(last-k >= 0){
        ret2.add(val * 10 + last-k)
      }
      if(last+k<=9){
        ret2.add(val * 10 + last+k)
      }
    }
    ret = ret2;
  }
  if(n===1){
    ret.add(0)
  }
  return Array.from(ret)
};



let ret = numsSameConsecDiff(2,1);
console.log(ret)


