/*
根据传入的数组，返回这个数组的所有子集
返回的数组应该是去重的
子集顺序可以是任意顺序，只要都包含了就好了

function power(){

}
power([1,2,3]);  // => [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
* */


function power(arr) {
  let result = [[]];
  arr = Array.from(new Set(arr));
  arr.forEach(n => {
    result.forEach(m => {
      result.push(m.concat(n));
    });
  });
  return result;
}


console.log(power([1,2,3]))
