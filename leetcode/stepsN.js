// n层台阶， 每次爬1到2个台阶，一共有多少种方法

// steps(n) = steps(n-1) + steps(n-2)
// steps(1) = 1, steps(2) = 2;

function steps(n) {
  return n <= 2 ? n : steps(n-1) + steps(n-2)
}

console.log(steps(10));


function steps2 (n){
  if(n <=2 ){
    return n;
  }
  let n1 = 1;
  let n2 = 2;
  let sum;
  for (let i = 3; i<=n; i++){
    sum = n1 + n2;
    n1 = n2;
    n2 = sum;
  }
  return sum;
}

console.log(steps2(10));
