// 用数组的reduce来实现数组的map
Array.prototype._map = function (cb) {
  return this.reduce((pre, cur, curIndex, arr) => {
    pre[curIndex] = cb(cur, curIndex);
    return pre;
  }, []);

};

// 正常实现
Array.prototype.__map = function (cb) {
  let arr = [];
  this.forEach((val, idx) => {
    arr[idx] = cb(val, idx);
  });
  return arr;
};


// 测试代码：
function test() {
  let ar = [1, 2, 3, 4];
  let ar2 = ar._map(v => v * 2);
  let ar3 = ar.__map(v => v * 2);
  let ar4 = ar.map(v => v * 2);
  console.log(ar2);
  console.log(ar3);
  console.log(ar4);
}

test();
