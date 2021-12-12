// 找出最长回文子串

/*
利用动态规划的思想，把问题分解为相关的子问题，
然后从最基本的子问题出发来推导较大的子问题，直到所有的子问题都解决

过程：
1. 根据字符串长度建立矩阵dp, dp[i][j]标识从s[i]到s[j]的子串是否是回文串
2. 从小到大开始遍历不同长度的子串，遍历起始左下标 i,  得出结束右下标j=i+l
3. 判断当前子串是否是回文
   - 长度为1, 一定回文，l===0
   - 长度为2或3，判断首尾相同则为回文，s[i]===s[j]
   - 长度>3，判断首尾相同且去掉首尾之后仍为回文，s[i]===s[j]&&dp[i+1][j-1]
4. 记录长度最长的回文子串
* */
function longestPalindrome2(s) {
  let sl = s.length;
  let dp = [];
  let max = -1;
  let ret = '';
  for (let i = 0; i < sl; i++) {
    dp[i] = [];
  }
  for (let l = 0; l < sl; l++) { //  l为左下标到右下标的差值，即子串长度-1
    for (let i = 0; i + l < sl; i++) { // i为子串开始左下标
      let j = i + l;  // j为子串结束右下标
      if (l === 0) {  // 子串长度为1，必定是回文串
        dp[i][j] = true;
      } else if (l <= 2) { // 子串长度为2或3，首尾字符相同即为回文串
        dp[i][j] = s[i] === s[j];
      } else {
        dp[i][j] = s[i] === s[j] && dp[i + 1][j - 1];
      }
      if (l > max && dp[i][j]) {
        max = l;
        ret = s.slice(i, j+1);
      }
    }
  }
  console.log(dp);
  return ret;
}

let s = 'aabcaabaa';

let ret = longestPalindrome2(s);

console.log(ret);
