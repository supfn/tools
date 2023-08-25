/*
// 题目：扁平化对象，写一个函数，可以把一个对象转换成一个扁平的对象

flattenMap(obj){

}

function test(){
  let obj = {
    'a': {
      'b': {
        'c': 12,
        'd': 'Hello World'
      },
      'e': [1,2,3]
    }
  }
  let result = flattenMap(obj);
  console.log(result);
  // result: {
  //   'a/b/c': 12,
  //   'a/b/d': 'Hello World',
  //   'a/e': [1,2,3]
  // }
}
test()
*/


function flattenMap(obj) {
  const result = {};
  const isObject = val => Object.prototype.toString.call(val) === "[object Object]";

  const loop = (obj, path) => {
    Object.keys(obj).forEach(key => {
      if (isObject(obj[key])) {
        loop(obj[key], `${path}${key}/`)
      } else {
        result[`${path}${key}`] = obj[key]
      }
    })
  }
  loop(obj, '');
  return result;
}

function test(){
  let obj = {
    'a': {
      'b': {
        'c': 12,
        'd': 'Hello World'
      },
      'e': [1,2,3]
    }
  }
  let result = flattenMap(obj);
  console.log(result);
  // result: {
  //   'a/b/c': 12,
  //   'a/b/d': 'Hello World',
  //   'a/e': [1,2,3]
  // }
}
test()
