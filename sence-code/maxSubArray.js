// 求最大子数组的和
// https://leetcode-cn.com/problems/maximum-subarray/

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  let maxNum = Math.max(...nums);
  if (maxNum <= 0) {
    return maxNum;
  }
  let sum = 0, max = 0, _start = 0, start, end;
  for (let i = 0, len = nums.length; i < len; i++) {
    sum += nums[i];
    if (sum < 0) {
      sum = 0;
      // _start = i + 1;
    }
    if (sum > max) {
      max = sum;
      // end = i;
      // start = _start;
    }
  }
  return max;
};

let arr = [-1, -2, -3, -4, 4, -3, 2, 0, 4, -5, 6];

// console.time('maxSubArray');
// let ret = maxSubArray(arr);
// console.log(ret);
// console.timeEnd('maxSubArray');


// 标准动态规划
// dp[i] 定义为数组nums 中已num[i] 结尾的最大连续子数组的和，
// 则有dp[i] = max(dp[i-1] + nums[i], num[i]);
let maxSubArray2 = function(nums) {
  let dp = new Array(nums.length);
  dp[0] = nums[0];
  let max = dp[0];
  for (let i = 1, l = nums.length; i < l; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    if (dp[i] > max) {
      max = dp[i];
    }
  }
  return max;
};

// console.time('maxSubArray2');
// let ret2 = maxSubArray2(arr);
// console.log(ret2);
// console.timeEnd('maxSubArray2');



// 考虑到 dp[i] 只和 dp[i-1] 相关，
// 于是我们可以只用一个变量 pre 来维护对于当前 dp[i] 的 dp[i-1] 值是多少
// 从而让空间复杂度降低到 O(1)，这有点类似「滚动数组」的思想。
let maxSubArray3 = function(nums) {
  let pre = 0;
  let max = nums[0];
  for (let i = 0, l=nums.length; i<l; i++){
    pre = Math.max(pre + nums[i], nums[i]);
    max = Math.max(max, pre);
  }
  return max;
};


console.time('maxSubArray3');
let ret3 = maxSubArray2(arr);
console.log(ret3);
console.timeEnd('maxSubArray3');
