/*
扁平化对象：写一个函数，可以把一个对象转换成一个扁平的对象,具体如下

let a = {
  'a': {
    'b': {
      'c': 12,
      'd': 'Hello World'
    },
    'e': [1,2,3]
  }
}
flattenMap(a);
return {
  'a/b/c': 12,
  'a/b/d': 'Hello World',
  'a/e': [1,2,3]
}

* */

const isObject = val => Object.prototype.toString.call(val) === "[object Object]";

function flattenMap(map) {
  const result = {};

  const loop = (map, path) => {
    Object.keys(map).forEach(key => {
      if (isObject(map[key])) {
        loop(map[key], `${path}${key}/`)
      } else {
        result[`${path}${key}`] = map[key]
      }
    })
  }
  loop(map, '');
  return result;
}

