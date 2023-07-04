/*
题目：
给定一个m*n的格子或棋盘，问从左上角走到右下角的走法总数。
每次只能向右或向下移动一个方格


分析：
1 2 3
4 5 6
7 8 9

f(m,n) = f(m-1, n) + f(m, n-1)

f(1,1) = 1;
f(1,2) = 1;
f(2,1) = 1;


*  m1  m2  m3  m4  m5  m6  m7
n1 1   1   1   1   1   1   1
n2 1   2   3   4   5   6   7
n3 1   3   6   10  15  21  28
n4 1   4   10
n5 1   5   15
n6 1   6   21
n7 1   7   28

* */

// 解1: 动态规划
function matrixTraversal(matrix) {
  let m = matrix[0].length;
  let n = matrix.length;
  const map = new Map();

  const traversal = (m, n) => {
    if (m < 1 || n < 1) {
      return 0;
    }
    if (m === 1 || n === 1) {
      return 1;
    }
    let key = `${m}_${n}`;
    if (map.has(key)) {
      return map.get(key);
    }
    let value = traversal(m - 1, n) + traversal(m, n - 1);
    map.set(key, value);
    return value;
  };

  return traversal(m, n);
}

// 解2：看成是深度优先遍历一颗树
function matrixTraversal2(matrix) {
  let m = matrix[0].length;
  let n = matrix.length;
  const traversal = (m, n) => {
    let sum = 0;
    if (m === 1 && n === 1) {
      return 1;
    }
    if (m > 1) {
      sum = sum + traversal(m - 1, n);
    }
    if (n > 1) {
      sum = sum + traversal(m, n - 1);
    }
    return sum;
  };
  return traversal(m, n);
}

const matrix = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
];

const matrix2 = [
  [1,2,3],
  [1,2,3],
];

console.time('traversalTime');
const ret = matrixTraversal(matrix);
console.log(ret);
console.timeEnd('traversalTime');

console.log("======================");

console.time('traversalTime2');
const ret2 = matrixTraversal2(matrix);
console.log(ret2);
console.timeEnd('traversalTime2');
