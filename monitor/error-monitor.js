import Vue from "vue";

class ErrorReport {
  constructor(ops = {}) {
    // 上报Error地址
    this.reportUrl =
      ops.reportUrl || `${window.location.origin}/errorReport`;

    this.options = {
      appId: "", // 项目ID
      appName: "", // 项目名称
      browser: getBrowser(),
      device: getDevices(),
      userId: "", // userId
      token: "", // token
      timeSpan: "", // 发送数据时的时间戳
      infoType: "error", // 信息类别
      userAgent: navigator.userAgent, // userAgent
      pageUrl: window.location.href, // 上报页面地址
      env: "dev", // 环境：dev、test、uat、pro

      msg: "", // 错误的具体信息,
      stack: "", // 错误堆栈信息
      localStorageKey: "error_report_data", // localStorageKey
      category: "", // 类别
      data: {} // 更多错误信息
    };

    Object.assign(this.options, ops);

    this.initErrorHandle();
  }



  initErrorHandle() {
    this.onJSError();
    this.onResourceError();
    this.onPromiseError();
    this.onAjaxError();
    this.onFetchError();
    this.onCosoleError();
    this.onVueError();
  }

  /**
   * 监控 JS 错误，加载第三方JS出现
   * 其中包括行列号，Error对象中存在错误的堆栈信息等。
   */
  onJSError() {
    window.onerror = (msg, url, line, col, error) => {
      if (msg === "Script error." && !url) {
        return false;
      }

      const reportData = { ...this.options };

      // 不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
      const colNum =
        col || (window.event && window.event.errorCharacter) || 0;

      if (error && error.stack) {
        // msg信息较少,如果浏览器有追溯栈信息,使用追溯栈信息
        reportData.msg = msg;
        reportData.stack = error.stack;
      } else {
        reportData.msg = msg;
        reportData.stack = "";
      }

      reportData.category = "JS_ERROR";
      reportData.timeSpan = Date.now();
      reportData.data = JSON.stringify({
        fileName: url,
        line: line,
        col: colNum
      });

      this.send(reportData, this.options.reportUrl);

      // 错误不会console浏览器上,如需要，可将这注释
      // return true;
    };
  }

  /**
   * 监控资源加载错误(img,script,css,以及jsonp)
   * 其中包括行列号，Error对象中存在错误的堆栈信息等。
   */
  onResourceError() {
    window.addEventListener(
      "error",
      e => {
        const target = e.target || e.srcElement;
        let isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
        if (!isElementTarget) {
          // JS_ERROR 不再处理
          return;
        }
        // if (e.target === window) {
        //   // 抛去js语法错误
        //   return;
        // }

        const reportData = { ...this.options };
        let url = target.src || target.href;
        reportData.msg = `${e.target.localName}(${url})  is load error`;
        reportData.stack = "resouce is not found";
        reportData.category = "RESOURCE_ERROR";
        reportData.data = JSON.stringify({
          tagName: e.target.localName,
          html: target.outerHTML,
          type: e.type,
          fileName: e.target.currentSrc,
          url
        });

        this.send(reportData, this.options.reportUrl);
      },
      true
    );
  }

  // 监控未捕获的promise异常
  onPromiseError() {
    window.addEventListener(
      "unhandledrejection",
      event => {
        const reportData = { ...this.options };
        // 错误信息
        reportData.msg = event.reason || "";
        reportData.category = "Promise";
        reportData.stack = "Promise is Error";
        this.send(reportData, this.options.reportUrl);
        // 如果想要阻止继续抛出，即会在控制台显示 `Uncaught(in promise) Error` 的话，调用以下函数
        event.preventDefault();
      },
      true
    );
  }

  // Ajax请求错误监控
  onAjaxError() {
    // 处理XMLHttpRequest
    if (!window.XMLHttpRequest) {
      return;
    }

    // 复制send方法
    let oldSend = XMLHttpRequest.prototype.send;

    let errorHandler = (event) => {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        config.sendError({
          title: event.target.responseURL,
          msg: {
            response: event.target.response,
            responseURL: event.target.responseURL,
            status: event.target.status,
            statusText: event.target.statusText
          },
          category: 'ajaxError',
        });
        const reportData = { ...this.options };
        reportData.msg = "AJAX 请求错误";
        reportData.stack = `错误码：${event.currentTarget.status}`;
        reportData.category = "AJAX_ERROR";
        this.send(reportData);
      }
    }

    // 重写send方法
    XMLHttpRequest.prototype.send = function () {
      if (this['addEventListener']) {
        this['addEventListener']('error', errorHandler);
        this['addEventListener']('load', errorHandler);
        this['addEventListener']('abort', errorHandler);
      } else {
        let oldStateChange = this['onreadystatechange'];
        this['onreadystatechange'] = function (event) {
          if (this.readyState === 4) {
            errorHandler(event);
          }
          oldStateChange && oldStateChange.apply(this, arguments);
        };
      }
      return oldSend.apply(this, arguments);
    };
  }

  // fetch请求错误
  onFetchError() {
    if (!window.fetch) {
      return;
    }
    let oldFetch = window.fetch;
    window.fetch = function () {
      return oldFetch.apply(this, arguments)
        .then(res => {
          if (!res.ok) { // True if status is HTTP 2xx
            const reportData = { ...this.options };
            reportData.msg = `fetch 请求错误: ${res}`;
            reportData.stack = `错误码：${arguments[0]}`;
            reportData.category = "FETCH_ERROR";
            this.send(reportData);
          }
          return res;
        })
        .catch(error => {
          const reportData = { ...this.options };
          reportData.msg = `fetch 请求错误: ${error.message}`;
          reportData.stack = error.stack;
          reportData.category = "FETCH_ERROR";
          this.send(reportData);
          throw error;
        });
    };
  }

  // console.error 错误
  onCosoleError() {
    if (!window.console || !window.console.error) {
      return;
    }

    let oldConsoleError = window.console.error;
    window.console.error = function () {
      const reportData = { ...this.options };
      reportData.msg = `console error: ${Array.prototype.join.call(arguments, ',')}`;
      reportData.category = "CONSOLE_ERROR";
      this.send(reportData);
      oldConsoleError && oldConsoleError.apply(window, arguments);
    };
  }

  // Vue 异常监控
  onVueError() {
    if (!Vue || !Vue.config) {
      return;
    }
    Vue.config.errorHandler = (error, vm, info) => {
      const componentName = this.formatComponentName(vm);
      const propsData = vm.$options && vm.$options.propsData;

      const reportData = { ...this.options }
      reportData.msg = error.message;
      reportData.stack = this.processStackMsg(error);

      reportData.category = "VUE_ERROR";
      reportData.data = JSON.stringify({
        componentName,
        propsData,
        info
      });
      this.send(reportData);
    };
  }

  /* eslint-disable class-methods-use-this */
  processStackMsg(error) {
    let stack = error.stack
      .replace(/\n/gi, "") // 去掉换行，节省传输内容大小
      .replace(/\bat\b/gi, "@") // chrome中是at，ff中是@
      .split("@") // 以@分割信息
      .slice(0, 9) // 最大堆栈长度（Error.stackTraceLimit = 10），所以只取前10条
      .map(v => v.replace(/^\s*|\s*$/g, "")) // 去除多余空格
      .join("~") // 手动添加分隔符，便于后期展示
      .replace(/\?[^:]+/gi, ""); // 去除js文件链接的多余参数(?x=1之类)
    const msg = error.toString();
    if (stack.indexOf(msg) < 0) {
      stack = msg + "@" + stack;
    }
    return stack;
  }

  /* eslint-disable class-methods-use-this */
  formatComponentName(vm) {
    if (vm.$root === vm) {
      return "root";
    }
    const name = vm._isVue
      ? (vm.$options && vm.$options.name) ||
      (vm.$options && vm.$options._componentTag)
      : vm.name;
    return (
      (name ? "component <" + name + ">" : "anonymous component") +
      (vm._isVue && vm.$options && vm.$options.__file
        ? " at " + (vm.$options && vm.$options.__file)
        : "")
    );
  }

  /**
  * 数据发送
  */
  send(data, reportUrl) {
    if (navigator.sendBeacon) {
      return this.sendByBeacon(data, reportUrl);
    }
    this.sendByImage(data, reportUrl);
  }

  sendByBeacon(data, reportUrl) {
    navigator.sendBeacon(reportUrl, JSON.stringify(data));
  }

  sendByImage(data, reportUrl) {
    const image = new Image();
    const queryStr = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&')
    image.src = `${reportUrl}?${queryStr}`;
  }
}


/**
 * 获取浏览器类型
 */
function getBrowser() {
  // 取得浏览器的userAgent字符串
  const userAgent = navigator.userAgent;
  let isOpera = false;

  // 判断是否Opera浏览器
  if (userAgent.indexOf("Opera") > -1) {
    isOpera = true;
    return "Opera";
  }
  // 判断是否Firefox浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  }
  // 判断是否Chrome浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  // 判断是否Safari浏览器
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  }
  // 判断是否IE浏览器
  if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1 &&
    !isOpera
  ) {
    return "IE";
  }
  // 判断是否QQ浏览器
  if (userAgent.match(/MQQBrowser\/([\d.]+)/i)) {
    return "QQBrower";
  }
  return "Other";
}

/**
 * 获取设备是安卓、 IOS 还是PC端
 */
function getDevices() {
  const ua = navigator.userAgent;
  let isIPad = false;
  let isIPod = false;

  if (ua.match(/(Android)\s+([\d.]+)/i)) {
    return "Android";
  }
  if (ua.match(/(iPad).*OS\s([\d_]+)/i)) {
    isIPad = true;
    return "iPad";
  }
  if (ua.match(/(iPod).*OS\s([\d_]+)/i)) {
    isIPod = true;
    return "iPod";
  }
  if (!isIPad && !isIPod && ua.match(/(iPhone\sOS)\s([\d_]+)/i)) {
    return "iPhone";
  }
  return "PC";
}


export const plugin = {
  install(Vue, options) {
    /* eslint-disable no-new */
    new ErrorReport(options);
  }
}