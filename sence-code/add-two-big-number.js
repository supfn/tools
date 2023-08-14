/**
 * 题目：两个大数相加
 * 
 * 解题思路：
 * 1. 较短的数字字符前置补零，补到二者长度相同
 * 2. 逐位相加，记录进位carry，记录结果到结果数组
 * 3. 最后将结果数组转字符
 */
function addTwoBigNumber(num1, num2) {
  let max = Math.max(num1.length, num2.length);
  num1 = num1.padStart(max, '0');
  num2 = num2.padStart(max, '0')
  let carry = 0;
  let result = new Array(max);
  for (let i = max - 1; i >= 0; i--) {
    let sum = Number(num1[i]) + Number(num2[i]) + carry;
    carry = Math.floor(sum / 10);
    let num = sum % 10;
    result[i] = num;
  }
  if (carry !== 0) {
    result.unshift(carry)
  }
  return result.join('');
}


// 测试代码
function test1() {
  let ret1 = addTwoBigNumber('123', '90');
  console.log(ret1);
}
test1();



// 2.	两个超大浮点数相加
function addTwoBigFloat(s1, s2) {
  let n1Arr = s1.split('.')[1].split('').map(Number);
  let n2Arr = s2.split('.')[1].split('').map(Number);

  let n1ArrLen = n1Arr.length;
  let n2ArrLen = n2Arr.length;
  let maxLen = Math.max(n1ArrLen, n1ArrLen);
  if (n1ArrLen < n2ArrLen) {
    n1Arr = n1Arr.concat(Array(maxLen - n1ArrLen).fill(0))
  }
  if (n2ArrLen < n1ArrLen) {
    n2Arr = n2Arr.concat(Array(maxLen - n2ArrLen).fill(0))
  }
  let carry = 0;
  let result = new Array(maxLen);
  for (let i = maxLen - 1; i >= 0; i--) {
    let num = n1Arr[i] + n2Arr[i];
    if (num >= 10) {
      carry = 1;
      num = num % 10;
    } else {
      carry = 0;
    }
    result[i] = num;
  }
  return `${carry}.` + result.join('');
}


function test2() {
  let ret2 = addTwoBigFloat('22.111', '12.234');
  console.log(ret2);
}
test2()
