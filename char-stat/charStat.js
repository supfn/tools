const http = require("http");

function charStat(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let arr = new Array(123).fill(0), result = {}, chars = "abcdefghijklmnopqrstuvwxyz";
      for (let i = 0, l = chars.length; i < l; i++) {
        result[chars[i]] = 0;
      }
      res.on('data', chunk => {
        let resText = chunk.toString().replace(/[^a-z]/ig, '');
        for (let i = 0, l = resText.length; i < l; i++) {
          let code = resText[i].charCodeAt();
          if (code >= 97 && code <= 122) {
            arr[code]++;
          } else if (code >= 65 && code <= 90) {
            arr[code]++;
          }
        }
      });
      res.on('end', () => {
        for (let i = 97; i <= 122; i++) {
          result[String.fromCharCode(i)] = arr[i] + arr[i - 32];
        }
        resolve(result);
      });
    });
  });
}


console.time('char-stat');
charStat('http://www.sina.com.cn').then(result => {
  console.timeEnd('char-stat');
  console.log(result);
}).catch(e => console.log(e));


module.exports = charStat;
