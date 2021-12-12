/*
给定一个8x8的棋盘, 上⾯面有若⼲个车(Rook), 写⼀个函数检查这些车有没有互相攻击的情况. 如果横
列或者竖列同样也有1，即为互相攻击，输⼊参数是一个由0和1组成的二维数组.
*/

let arr = [
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0]
];


function checkConflict(arr) {
  let rows = arr.length;
  let cols = arr[0].length;
  let rowRockNums = new Array(rows).fill(0); // 每行车的数量
  let colRockNums = new Array(cols).fill(0); // 每列车的数量
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (arr[i][j]) {
        rowRockNums[i]++;
        colRockNums[j]++;
        if (rowRockNums[i] > 1 || colRockNums[j] > 1) {
          return false;
        }
      }
    }
  }
  console.log(rowRockNums,colRockNums);
  return true;
}

// let ret =  checkConflict(arr);
// console.log(ret);


/*
假设当前场景没有互相攻击，那么最多还能放置多少辆车？有多少种放法？
 */

let arr2 = [
  [0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
function checkConflictPut(arr){
  let rows = arr.length;
  let cols = arr[0].length;
  let rowRockNums = new Array(rows).fill(0); // 每行车的数量
  let colRockNums = new Array(cols).fill(0); // 每列车的数量
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (arr[i][j]) {
        rowRockNums[i]++;
        colRockNums[j]++;
        if (rowRockNums[i] > 1 || colRockNums[j] > 1) {
          return false;
        }
      }
    }
  }
  let emptyRows = [];
  let emptyCols = [];
  for(let i = 0; i<rowRockNums.length; i++){
    if(rowRockNums[i] === 0){
      emptyRows.push(i);
    }
  }
  for (let i =0; i<colRockNums.length; i++){
    if(colRockNums[i]===0){
      emptyCols.push(i);
    }
  }

  let maxPut = Math.min(emptyRows.length, emptyCols.length);

  // f1 = 1
  // f2 = 2
  // f3 = 3
  // f4 =


  return true;
}


let ret2 =  checkConflict(arr2);
console.log(ret2);
