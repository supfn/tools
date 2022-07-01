// 二叉树的遍历，给定一个二叉树和一个值sum,找到所有根节点到叶子节点值的节点值之和为sum的路径
// hasSum(root,sum)
// https://leetcode-cn.com/problems/path-sum-ii/

/**
 * Definition for a binary tree node.
 * function TreeNode(value, left, right) {
 *     this.value = (value===undefined ? 0 : value)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
let pathSum = function(root, targetSum) {
  let ret = [];
  if (!root) {
    return ret;
  }
  const dfs = (treeNode, path) => {
    if (!treeNode.left && !treeNode.right) {
      let currentSum = path.reduce((pre, cur) => pre + cur, 0);
      if (currentSum + treeNode.value === targetSum) {
        ret.push([...path, treeNode.value]);
      }
    } else {
      treeNode.left && dfs(treeNode.left, [...path, treeNode.value]);
      treeNode.right && dfs(treeNode.right, [...path, treeNode.value]);
    }
  };
  dfs(root, []);
  return ret;
};

const root = {
  value: 1,
  left: {
    value: 4,
    left: {
      value: 7,
    },
    right: {
      value: 2,
      left: {
        value: 5,
      },
      right: {
        value: 5,
        left: {
          value: 1,
        },
      },
    },
  },
  right: {
    value: 3,
    left: {
      value: 5,
      left: {
        value: 3,
      },
    },
    right: {
      value: 6,
      left: {
        value: 5,
      },
      right: {
        value: 2,
      },
    },
  },
};

console.log(pathSum(root, 13));


