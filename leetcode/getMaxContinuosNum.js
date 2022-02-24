/*
 * 根据传入的数字，返回其中包含的最大的连续五位数
 * e.g.
 * 283910356876 => 91035
 * 123456 => 23456
 * param Number String（可以转换为数字的字符串）
 * PS：传入的参数最大长度为1000位
 * return Number
 */



function solution(digits){
  const str = digits.toString();
  let max = 0;
  let n = str.length - 5;
  let tmp = 0;
  for (let i=0; i <= n; i++) {
    tmp = Number(str.substring(i, i + 5));
    max = Math.max(max, tmp)
  }
  return max;
}
