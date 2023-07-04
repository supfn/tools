/**
 * Reference: https://www.codewars.com/kata/a-chain-adding-function
 * 
 * Description:
 * want to create a function that will add numbers together when called in succession.
 * example: 
 * add(1)(2); // 3
 * 
 * We also want to be able to continue to add numbers to our chain.
 * example:
 * add(1)(2)(3); // 6
 * add(1)(2)(3)(4); // 10
 * add(1)(2)(3)(4)(5); // 15
 * 
 * A single call should return the number passed in.
 * example
 * add(1) // 1
 * 
 * and we should be able to store the result and reuse it.
 * var addTwo = add(2);
 * addTwo // 2
 * addTwo + 5 // 7
 * addTwo(3) // 5
 * addTwo(3)(5) // 10
 * 
 * We can assume any number being passed in will be valid javascript number.
 */

/**
 * Thinking:
 * 由于要一个数记住每次的计算值，所以使用了闭包，在addFake中记住了x的值，第一次调用add(), 初始化了addFake，并将n保存在addFake的作用链中，
 * 然后返回addFake保证了第二次调用的是addFake函数，后面的计算都是在调用addFake, 
 * 因为addFake也是返回的自己，保证了第二次之后的调用也是调用addFake，而在addFake中将传入的参数x与保存在作用链中n相加并赋值给n，这样就保证了计算。
 * 但是在计算完成后还是返回了addFake这个函数，这样就获取不到计算的结果了，我们需要的结果是一个计算的数字
 * 那么怎么办呢，首先要知道JavaScript中，打印和相加计算，会分别调用toString或valueOf函数，所以我们重写addFake的toString和valueOf方法，返回x的值
 */


function add1(n) {
  let addFake = (x) => {
    n += x;
    return addFake;
  };
  addFake.toString = addFake.valueOf = () => n;
  return addFake;
}


function add2(n) {
  const f = x => add2(n + x)
  f.valueOf = f.toString = () => n
  return f;
}


// Support multiple parameters
let add3 = function () {
  let sum = Array.from(arguments).reduce((pre, cur) => pre + cur, 0);
  let addF = () => {
    sum += Array.from(arguments).reduce((pre, cur) => pre + cur, 0);
    return addF;
  };
  addF.toString = addF.valueOf = () => sum;
  return addF;
};

function test() {
  let add = add2;
  console.log(add(1));
  console.log(add(1)(2)(3));

  addTwo = add(2);
  console.log(addTwo + 5);
  console.log(addTwo(3));
  console.log(addTwo(3)(5));
}
test()