/**
* 性能监控
*/
class PerformanceMonitor {
  constructor(ops) {
    this.options = {
      reportUrl: "", // 上报地址
      appId: "", // 项目ID
      appName: "", // 项目名称,
      env: "dev", // 环境：dev、test、uat、pro
      infoType: "preformance", // 信息类别
      timeSpan: Date.now(), // 发送数据时的时间戳
      userAgent: navigator.userAgent,
    };
    Object.assign(this.options, ops);
    this.init();
  }

  init() {
    window.addEventListener("load", () => {
      setTimeout(() => this.sendPerformanceData(), 0);
    });
  }

  getPerformanceData() {
    const { timing, memory, navigation } = window.performance;
    const {
      navigationStart = 0, // 准备加载页面的起始时间
      //   unloadEventStart = 0, // 如果前一个文档和当前文档同源,返回前一个文档开始unload的时间
      //   unloadEventEnd = 0, // 如果前一个文档和当前文档同源,返回前一个文档开始unload结束的时间
      //   redirectStart = 0, // 如果有重定向,这里是重定向开始的时间.
      //   redirectEnd = 0, // 如果有重定向,这里是重定向结束的时间.
      fetchStart = 0, // 开始检查缓存或开始获取资源的时间
      domainLookupStart = 0, //  开始进行dns查询的时间
      domainLookupEnd = 0, //  dns查询结束的时间
      connectStart = 0, // 开始建立连接请求资源的时间
      connectEnd = 0, // 建立连接成功的时间.
      //   secureConnectionStart = 0, // 如果是https请求.返回ssl握手的时间
      //   requestStart = 0, // 开始请求文档时间(包括从服务器,本地缓存请求)
      responseStart = 0, // 接收到第一个字节的时间
      responseEnd = 0, // 接收到最后一个字节的时间.
      //   domLoading = 0, // ‘current document readiness’ 设置为 loading的时间 (这个时候还木有开始解析文档)
      domInteractive = 0, // 文档解析结束的时间
      //   domContentLoadedEventStart = 0, // DOMContentLoaded事件开始的时间
      domContentLoadedEventEnd = 0, // DOMContentLoaded事件结束的时间
      domComplete = 0, // current document readiness被设置 complete的时间
      //   loadEventStart = 0, // 触发onload事件的时间
      loadEventEnd = 0 // onload事件结束的时间
    } = timing;

    const {
      usedJSHeapSize = 0, // JS 对象（包括V8引擎内部对象）占用的内存，一定小于 totalJSHeapSize，否则可能出现内存泄漏
      totalJSHeapSize = -1 // 可使用的内存
    } = memory;

    // 准备新页面时间耗时
    const prepareNewPageTime = fetchStart - navigationStart;
    // DNS查询耗时
    const queryDNSTime = domainLookupEnd - domainLookupStart;
    // TCP链接耗时
    const connectionTCPTime = connectEnd - connectStart;
    // request请求耗时
    const requestTime = responseEnd - responseStart;
    // 解析dom树耗时
    const analysisDOMTime = domComplete - domInteractive;
    // 白屏时间
    const whiteScreenTime = responseStart - navigationStart;
    // domready时间
    const domReadyTime = domContentLoadedEventEnd - navigationStart;
    // onload执行完成时间
    const onloadSuccessTime = loadEventEnd - navigationStart;

    // 内存是否溢出
    const memoryOverFlow = totalJSHeapSize > usedJSHeapSize ? 0 : 1;

    // 页面的加载方式
    const pageLoadType = navigation.type;

    return {
      prepareNewPageTime,
      queryDNSTime,
      connectionTCPTime,
      requestTime,
      analysisDOMTime,
      whiteScreenTime,
      domReadyTime,
      onloadSuccessTime,
      memoryOverFlow,
      pageLoadType
    };
  }

  sendPerformanceData() {
    const performanceInfo = this.getPerformanceData();
    Object.assign(performanceInfo, obj, {
      timeSpan: Date.now()
    });
    const { reportUrl } = this.options;
    this.send(performanceInfo, reportUrl);
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