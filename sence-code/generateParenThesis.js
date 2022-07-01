/*
括号。设计一种算法，打印n对括号的所有合法的（例如，开闭一一对应）组合。

说明：解集不能包含重复的子集。

例如，给出 n = 3，生成结果为：
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
* */


/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  let ret = new Set(["()"]);
  while (--n > 0){
    let ret2 = new Set();
    for(let bracket of ret){
      for(let i=0; i<=bracket.length; i++){
        let bracket2 = bracket.slice(0,i) + '()' +  bracket.slice(i)
        ret2.add(bracket2)
      }
    }
    ret = ret2;
  }
  return Array.from(ret);
};


const ret = generateParenthesis(3);
console.log(ret);
