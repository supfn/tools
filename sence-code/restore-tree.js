/* 
// 还原扁平的树结构，id 表示当前节点 id，parentId 表示其父节点 id，parentId 为 0 表示无父节点
// 结构如下:
const treeList = [
  { id: 1, parentId: 2 },
  { id: 2, parentId: 0 },
  { id: 3, parentId: 4 },
  { id: 4, parentId: 0 },
  { id: 5, parentId: 4 },
  { id: 6, parentId: 2 },
  { id: 7, parentId: 2 },
  { id: 8, parentId: 3 },
];

function restoreTree(treeList){
}

function test() {
  let ret = JSON.stringify(restoreTree(treeList), null, 2)
  console.log(ret);
}
test(); 
*/


const treeList = [
  { id: 1, parentId: 2 },
  { id: 2, parentId: 0 },
  { id: 3, parentId: 4 },
  { id: 4, parentId: 0 },
  { id: 5, parentId: 4 },
  { id: 6, parentId: 2 },
  { id: 7, parentId: 2 },
  { id: 8, parentId: 3 },
];
function restoreTree(treeList) {
  let result = [];
  let levelList = [];

  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].parentId === 0) {
      result.push(treeList[i]);
    } else {
      levelList.push(treeList[i]);
    }
  }

  const handle = (parent, child) => {
    if (!parent) {
      return;
    }
    if (parent.id === child.parentId) {
      parent.children = parent.children || [];
      parent.children.push(child);
      return;
    }
    if (parent.children) {
      parent.children.forEach((pChild) => {
        handle(pChild, child);
      });
    }
  };

  levelList.forEach((treeNode) => {
    result.forEach((pTreeNode) => {
      handle(pTreeNode, treeNode);
    });
  });

  return result;
};

function test() {
  let ret = JSON.stringify(restoreTree(treeList), null, 2)
  console.log(ret);
}
test();
