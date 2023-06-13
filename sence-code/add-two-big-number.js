// 1.	两个大数相加
function addTwoBigNumber(n1, n2) {
  let n1Arr = n1.split('').map(Number);
  let n2Arr = n2.split('').map(Number);
  let n1ArrLen = n1Arr.length;
  let n2ArrLen = n2Arr.length;
  let maxLen = Math.max(n1ArrLen, n1ArrLen);
  if (n1ArrLen < n2ArrLen) {
    n1Arr = Array(maxLen - n1ArrLen).fill(0).concat(n1Arr)
  }
  if (n2ArrLen < n1ArrLen) {
    n2Arr = Array(maxLen - n2ArrLen).fill(0).concat(n2Arr)
  }
  let carry = 0;
  let result = new Array(maxLen);
  for (let i = maxLen - 1; i >= 0; i--) {
    let num = n1Arr[i] + n2Arr[i] + carry;
    if (num >= 10) {
      carry = 1;
      num = num % 10;
    } else {
      carry = 0
    }
    result[i] = num;
  }
  if (carry > 0) {
    result.unshift(carry);
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
