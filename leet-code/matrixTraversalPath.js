/*
题目：
给定一个数字矩阵求从左上角到右下角距离最大。输出最大距离值。
路径只能是往右与往下走。

分析：
[
[1,2,3,4],
[1,2,3,4],
[1,2,3,4],
]

给定一个距离矩阵用来存放从左上角到该位置的最大距离值。
每输入一个值就计算该点的最大距离值。可以知道，该点的最大
距离值就是他的上方和左方两者之间的较大值+该点的值。

m=0,n=0 : maxPath[0][0] = matrix[0][0]

m=0 : maxPath[0][n] = maxPath[m][n-1] + matrix[m][n]

n=0 : maxPath[m][0] = maxPath[m-1][n] + matrix[m][n]

maxPath[m][n] = Max(maxPath[m-1][n], maxPath[m][n-1]) + matrix[m][n]


* */

function matrixTraversalMaxPath(matrix) {
  let maxPath = [];
  let rows = matrix.length;     // 行数
  let cols = matrix[0].length; // 列数
  for (let i = 0; i < rows; i++) {
    maxPath[i] = [];
  }

  // matrix[i][j];  第i行j列
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) {
        maxPath[0][0] = matrix[0][0];
      } else if (i === 0) {
        // 填入第一行
        maxPath[i][j] = maxPath[i][j - 1] + matrix[i][j];
      } else if (j === 0) {
        // 填入第一列
        maxPath[i][j] = maxPath[i - 1][j] + matrix[i][j];
      } else {
        maxPath[i][j] = Math.max(maxPath[i - 1][j], maxPath[i][j - 1]) +
          matrix[i][j];
      }
    }
  }

  return maxPath[rows - 1][cols - 1];
}

const matrix = [
  [1, 6, 7],
  [1, 2, 8],
  [1, 2, 3],
  [1, 2, 3],

];

console.time('traversalTime');
const ret = matrixTraversalMaxPath(matrix);
console.log(ret);
console.timeEnd('traversalTime');

