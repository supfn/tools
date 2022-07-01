// 找出升序数组经过一次翻转后的最小值
// 如：[1,2,3,4,5,6,7,8] 翻转后:  [7,8,1,2,3,4,5,6]
// https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/

// 二分查找
function findReverseArrMinNum(arr) {
  let left = 0;
  let right = arr.length - 1;
  let mid;
  while (right > left + 1) {
    mid = Math.floor((right + left) / 2);
    if (arr[right] > arr[mid]) {
      right = mid;
    } else {
      left = mid;
    }
  }
  return Math.min(arr[left], arr[right]);
}

let arr = [7, 8, 1, 2, 3];
// let arr = [1,2,3,4,5,6,7,8];
console.log(findReverseArrMinNum(arr));
