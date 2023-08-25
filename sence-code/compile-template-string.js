/* 
// 题目：实现一个具有模板字符串功能的函数
function compile(str, data) {

}
function test() {
  const data = {
    b: 'c',
    d: [{ e: 123 }]
  };
  const str = 'hello, ${b}, ${d[0].e}';
  let ret = compile(str, data); 
  console.log(ret); // 'hello, c, 123'
}
test();
*/

/**
 * 实现模板字符串
 * 
 * @param {String} str 
 * @param {Object} data 
 * @returns 
 */
function compile(str, data) {
  let reg = /\${(.*?)}/;
  let match = str.match(reg);
  while (match) {
    let origin = match[0];
    let exp = match[1];
    let keys = exp.split(/[\[\].]/g);
    let value = keys
      .filter((key) => key.length)
      .reduce((pre, next) => {
        return pre[next] || {};
      }, data);
    str = str.replace(origin, value);
    match = str.match(reg);
  }
  return str;
}

function test() {
  const a = {
    b: 'c',
    d: [{ e: 123 }]
  };
  const str = 'hello, ${b}, ${d[0].e}';
  let ret = compile(str, a); 
  console.log(ret); // 打印 'hello, c, 123'
}
test();
