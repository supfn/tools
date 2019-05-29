/* eslint-disable standard/no-callback-literal */

// 各种浏览器兼容
let hidden, state, visibilityChange;
if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
  state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
  hidden = "mozHidden";
  visibilityChange = "mozvisibilitychange";
  state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
  state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
  state = "webkitVisibilityState";
}

function onVisibilityChange(cb) {
  let timer = null;
  let oldPageVisibility = (!document[hidden] || document[state] === 'visible');

  let check = () => {
    let now = +new Date;
    timer = setInterval(() => {
      let newPageVisibility = (!document[hidden] || document[state] === 'visible');
      if (oldPageVisibility !== newPageVisibility) {
        cb(oldPageVisibility, newPageVisibility);
        clearInterval(timer);
        check();
      } else if (+new Date - now > 1800) {
        // 有些手机页面切到后台计时器会停止，定时器间隔1s，触发的前一秒页面可见. 即上一秒状态变化：不可见 => 可见
        cb(false, true);
        clearInterval(timer);
        check();
      }
      now += 1000;
    }, 1000);
  };

  check();

  let visibilityChangeFn = () => {
    let newPageVisibility = (!document[hidden] || document[state] === 'visible');
    let oldPageVisibility = !newPageVisibility;
    cb(oldPageVisibility, newPageVisibility);
    clearInterval(timer);
    // check();
    // 这里清除定时器后不再check了， 因为浏览器已经支持监听visibilityChange，就不必用定时器去hack了。
  };
  document.addEventListener(visibilityChange, visibilityChangeFn, false);
  return () => {
    clearInterval(timer);
    document.removeEventListener(visibilityChange, visibilityChangeFn, false);
  };
}

export {hidden, state, visibilityChange, onVisibilityChange};
