/**
 * Reference: https://www.codewars.com/kata/calculating-with-functions/train/javascript
 * 
 * Description:
 * This time we want to write calculations using functions and get the results. Let's have a look at some examples:
 * seven(times(five())); // must return 35
 * four(plus(nine())); // must return 13
 * eight(minus(three())); // must return 5
 * six(dividedBy(two())); // must return 3
 */


const createDigit = digit => {
  return op => op ? op(digit) : digit;
};
var zero = createDigit(0);
var one = createDigit(1);
var two = createDigit(2);
var three = createDigit(3);
var four = createDigit(4);
var five = createDigit(5);
var six = createDigit(6);
var seven = createDigit(7);
var eight = createDigit(8);
var nine = createDigit(9);

let plus = r => { return l => l + r }
let minus = r => { return l => l - r }
let times = r => { return l => l * r }
let dividedBy = r => { return l => l / r }

function test() {
  let r1 = seven(times(five())); // must return 35
  let r2 = four(plus(nine())); // must return 13
  let r3 = eight(minus(three())); // must return 5
  let r4 = six(dividedBy(two())); // must return 3
  console.log(r1, r2, r3, r4)
};

test();