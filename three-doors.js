// 获取随机3门 randDoors:[0,0,1]， 1门代表中奖
function getRandDoors() {
  let doors = [0, 0, 1];
  return doors.sort(() => Math.random() - 0.5);
}

// 获取单次选择结果 {randDoors, randPickIndex}
function randPick() {
  let randPickIndex = ~~(Math.random() * 3);
  let randDoors = getRandDoors();
  return {randDoors, randPickIndex};
}

// 去除一个0门
function deleteOneDoor({randDoors, randPickIndex}) {
  let deleteIndex = randDoors.findIndex((v, i) => i !== randPickIndex && !v);
  if (deleteIndex < randPickIndex) {
    randPickIndex -= 1;
  }
  randDoors.splice(deleteIndex, 1);
  return {randDoors, randPickIndex};
}

function main() {
  let tryTimes = 100000;
  let hitWithoutChange = 0;
  let hitWithChange = 0;
  for (let i = 0; i < tryTimes; i++) {
    let {randDoors, randPickIndex} = deleteOneDoor(randPick());
    hitWithoutChange += randDoors[randPickIndex]; // 不换门
    hitWithChange += randDoors[~~!randPickIndex]; // 换门
  }
  console.log(`change rate:  ${hitWithChange / tryTimes}`);
  console.log(`not change rate:  ${hitWithoutChange / tryTimes}`);
}

main();
