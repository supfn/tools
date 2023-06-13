/*
统计字符串内字符出现的个数

let genCode = 'TCCAGAAAGGTAAGCCTCGCGTTGCG' // 只限4个字母。可考虑实现多个字母的情况
let result = getCountedNucleotides(genCode);
console.log(result) // {"A":0, "C":0, "G":0, "T":0}
* */


function getCountedNucleotides (s){
  return s.split('').reduce((acc, cur) => {
    acc[cur] = acc[cur] ? acc[cur] + 1 : 1
    return acc;
  }, {})
}

let genCode = 'TCCAGAAAGGTAAGCCTCGCGTTGCG' // 只限4个字母。可考虑实现多个字母的情况
let result = getCountedNucleotides(genCode);
console.log(result) // {"A":0, "C":0, "G":0, "T":0}
