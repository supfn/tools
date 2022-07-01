/*
   实现模板字符串
   const a = {
      b: 'c',
      d: [{ e: 123 }]
    };
   const str = 'hello, ${b}, ${d[0].e}';
   compile(str, a); // 'hello, c, 123'
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