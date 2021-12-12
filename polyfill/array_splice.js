// 实现 Array.prototype.splice

Array.prototype._splice = function(start,delCount, ...items){
  if(start > 0){
    if(start > this.length-1){
      start = this.length -1;
    }
  }else{
    start = Math.abs(start);
    if(start > this.length){
      start = 0;
    }else{
      start = this.length - start;
    }
  }

  const newArr = [];
  const removedArr = [];
  delCount = isNaN(Number(delCount)) ? 0 : Number(delCount);

  for(let i=0; i<this.length;i++){
    if(i<start || i>start+delCount-1){
      newArr.push(this[i])
    }else {
      removedArr.push(this[i])
    }
    if(i === start+delCount-1){
      newArr.push(...items)
    }
  }

  for(let i = 0; i<newArr.length; i++){
    this[i] = newArr[i]
  }

  this.length = newArr.length;
  return removedArr;
};


let arr = [0,1,2,3,4];
let arr2 = arr.slice();

let removed = arr._splice(5,0,'00');
console.log(removed, arr);


let removed2 = arr2.splice(5,0,'00');
console.log(removed2, arr2);
