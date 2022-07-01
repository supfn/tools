// https://leetcode-cn.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/

/**
 * @param {string} seq
 * @return {number[]}
 */
var maxDepthAfterSplit = function(seq) {
  let seqLen = seq.length;
  let sa = [];
  let bracketA = "";
  let sb = [];
  let bracketB = "";
  let ret = Array(seqLen).fill(0);
  for(let i=0; i<seqLen; i++){
    if(seq[i] === "("){
      if(sa.length <= sb.length){
        sa.push(i);
        bracketA+='(';
        ret[i] = 0;
      }else{
        sb.push(i);
        bracketB+='(';
        ret[i] = 1;
      }
    }else{
      if(sa.length >= sb.length){
        sa.pop();
        bracketA+=')';
        ret[i] = 0;
      }else{
        sb.pop();
        bracketB+=')';
        ret[i] = 1;
      }
    }
  }
  console.log(`a: ${bracketA}, b: ${bracketB}`)
  return ret;
};

let ret = maxDepthAfterSplit("(()())");
console.log(ret);
