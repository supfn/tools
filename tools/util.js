// String | Number | Boolean | Array | Object | Function | Date | Null | Undefined
function isType(type) {
  return (val) => Object.prototype.toString.call(val).slice(8, -1) === type;
}

// 深拷贝
function deepClone(obj) {
  // 引入weakmap对Object类型数据进行标记
  const map = new WeakMap();
  map.set(obj, true);
  const isObj = obj => typeof obj === 'object' && obj !== null;
  const clone = (source) => {
    if (!isObj(source)) {
      return source;
    }
    // 如果拷贝过的Object直接返回
    if (map.get(source)) {
      return source
    }

    let result = Array.isArray(source) ? [] : {};
    map.set(source, result);
    // Reflect.ownKeys 是 Object.getOwnPropertyNames 和 Object.getOwnPropertySymbols 的并集
    for (let key of Reflect.ownKeys(source)) {
      result[key] = clone(result[key]);
    }
    return result;
  }
  return clone(obj);
}

// 深比较
function deepEqual(obj1, obj2) {
  // todo: 实现
}

// 数组去重
function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

// 扁平化多维数组 - 1
function flatten1(arr) {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flatten1(cur) : cur),
    []
  );
}

// 扁平化多维数组 - 2
function flatten2(arr) {
  return arr.toString().split(",");
}

// 创建一个长度为length的字符串，a-z A-Z 0-9
function getRandomString(len) {
  let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    s = "";
  while (len--) {
    let rand = Math.round(Math.random() * str.length);
    s += str.charAt(rand);
  }
  return s;
}

function randomStr(length) {
  let s = "";
  while (s.length < length) {
    s += Math.random().toString(36).substr(2);
  }
  return s.substr(0, length);
}

// 创建一个长度为len的数组，并且每个元素的值等于它的下标
function createArr(len) {
  return [...new Array(len).keys()];
}

// 判断num是否为一个整数
function isInteger(num) {
  return num % 1 === 0;
}

// 判断num是否为一个浮点数
function isFloat(num) {
  return num | (0 !== num);
}

// Number.prototype.toFixed 的修复
function toFixed(num, digits) {
  let times = Math.pow(10, digits);
  num = num * times + 0.5;
  num = parseInt(num) / times;
  return num + "";
}

// 用0补全位数
function prefixInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}

// 将数字类型转化为每3位一个逗号的货币格式
function cuter(str) {
  let len = str.length,
    str2 = "",
    max = Math.floor(len / 3);
  for (let i = 0; i < max; i++) {
    let s = str.slice(len - 3, len);
    str = str.substr(0, len - 3);
    str2 = "," + s + str2;
    len = str.length;
  }
  str += str2;
  return str;
}

function cuter2(str) {
  return str.replace(/\B(?=(?:\d{3})+$)/g, ",");
}

// 数组乱序 - 1
function shuffle1(arr) {
  let result = [];
  let sArr = arr.slice();
  while (sArr.length) {
    let index = ~~(Math.random() * sArr.length);
    result.push(sArr[index]);
    sArr.splice(index, 1);
  }
  return result;
}

// 数组乱序 - 2
function shuffle2(arr) {
  return arr.concat().sort((a, b) => {
    return Math.random() - 0.5;
  });
}

// 数组乱序 - 3
function shuffle3(arr) {
  let sArr = arr.concat();
  for (let i = sArr.length; i--;) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = sArr[i];
    sArr[i] = sArr[j];
    sArr[j] = temp;
  }
  return sArr;
}

// 数组乱序 - 4
function shuffle4(arr) {
  let length = arr.length;
  let shuffled = Array(length);
  for (let index = 0; index < length; index++) {
    let rand = ~~(Math.random() * (index + 1));
    if (rand !== index) shuffled[index] = shuffled[rand];
    shuffled[rand] = arr[index];
  }
  return shuffled;
}

// 从数组中随机取一个值
function getRandomValFromArr(arr) {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
}

// 在数组中插入一个元素
function insertElement(arr, value, index) {
  let arr1 = arr.slice(0, index);
  let arr2 = arr.slice(index);
  return arr1.concat(value, arr2);
}

// 在 async/await 中模拟sleep
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getImageSize(url) {
  let img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onerror = () => reject(new Error("load image error!"));
    img.onload = () => resolve({ width: img.width, height: img.height });
  });
}

function _qs(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

/**
 * 计算字符串字节长度: 在javascript中 中文占2位字节，英文字母以及数字占1位字节。
 * [\u4e00-\u9fa5]只匹配中文
 * [^\x00-\xff]这个匹配所有非ASCII的字符，也就是一般意义上的半角字符，而这些%！）（之类的是全角字符 。
 * @param str
 * @return {number}
 */
function getByteLength(str) {
  return str.replace(/[^\x00-\xff]/g, "xx").length;
  // return s.replace(/[\u4e00-\u9fa5]/g,'xx').length;
}

// 去掉字符串两端的空格
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 去掉字符串中所有的空格:
function trims(str) {
  return str.replace(/\s/g, "");
}

function trimLeft(str) {
  return str.replace(/(^\s*)/g, "");
}

function trimRight(str) {
  return str.replace(/(\s*$)/g, "");
}

function parseURL(url) {
  let a = document.createElement("a");
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(":", ""),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      let ret = {},
        seg = a.search.replace(/^\?/, "").split("&"),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split("=");
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
    hash: a.hash.replace("#", ""),
    path: a.pathname.replace(/^([^\/])/, "/$1"),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
    segments: a.pathname.replace(/^\//, "").split("/"),
  };
}

/**
 * 复制到剪切板
 * @param value
 * @return {((commandId: string, showUI?: boolean, value?: any) => boolean) | boolean}
 * input.select()在ios下并没有选中全部内容 更换为 input.setSelectionRange(0, 9999);
 * ios下会拉起键盘又瞬间收起，因为聚焦到了输入域，要让输入域不可输入，添加input.setAttribute('readonly','readonly');
 */
function copy(value) {
  const input = document.createElement("input");
  input.setAttribute("readonly", "readonly");
  input.setAttribute("value", value);
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 9999);
  let res = document.execCommand && document.execCommand("copy");
  document.body.removeChild(input);
  return res;
}

// 节流：每隔wait ms只触发一次fn
// tail 尾调用：停止触发func之后的wait ms之后执行func
function throttle(fn, wait = 20, tail = false) {
  let invoking = false;
  let timer = null;
  return function () {
    let args = arguments;
    let context = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!invoking) {
      invoking = true;
      setTimeout(() => (invoking = false), wait);
      fn.apply(context, args);
    } else {
      // 尾调用 让方法在脱离事件后也能执行一次
      if (tail) {
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, wait);
      }
    }
  };
}

// 防抖：停止触发func之后的 {wait}ms 之后执行func
function debounce(fn, wait) {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    let args = arguments;
    let context = this;
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}

// 获取某年某月份的天数
function getDaysByYearAndMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
