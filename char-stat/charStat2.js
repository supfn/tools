let arr = new Array(123).fill(0), result = {}, chars = "abcdefghijklmnopqrstuvwxyz";
for (let i = 0, l = chars.length; i < l; i++) {
  result[chars[i]] = 0;
}

function charStat2(txt) {
  txt = txt.replace(/[^a-z]/ig, '');
  return new Promise(resolve => {
    for (let i = 0, l = txt.length; i < l; i++) {
      let code = txt[i].charCodeAt();
      if (code >= 97 && code <= 122) {
        arr[code]++;
      } else if (code >= 65 && code <= 90) {
        arr[code]++;
      }
    }
    for (let i = 97; i <= 122; i++) {
      result[String.fromCharCode(i)] = arr[i] + arr[i - 32];
    }
    resolve(result);
  });
}

module.exports = charStat2;
