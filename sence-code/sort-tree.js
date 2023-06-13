// 还原扁平的树结构，结构如下，id表示当前节点id，parentId表示其父节点id。
const listTree = [
  { id: 1, parentId: 2 },
  { id: 2, parentId: 0 },
  { id: 3, parentId: 4 },
  { id: 4, parentId: 0 },
  { id: 5, parentId: 4 },
  { id: 6, parentId: 2 },
  { id: 7, parentId: 2 },
  { id: 8, parentId: 3 },
];

const sortTree = (list) => {
  let result = [];
  let nList = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId === 0) {
      result.push(list[i]);
    } else {
      nList.push(list[i]);
    }
  }
  const sort = (parent, child) => {
    if (!parent) {
      return;
    }
    if (parent.id === child.parentId) {
      if (parent.child) {
        parent.child.push(child);
      } else {
        parent.child = [child];
      }
      return;
    }
    if (parent.child) {
      parent.child.forEach((v) => {
        sort(v, child);
      });
    }
    return;
  };
  nList.forEach((v) => {
    result.forEach((i) => {
      sort(i, v);
    });
  });
  return result;
};

// 测试代码
function test() {
  console.log(sortTree(listTree));
}

test();
