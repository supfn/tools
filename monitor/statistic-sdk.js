
class StatisticSDK {
  constructor(bizID) {
    this.bizID = bizID;
    this.initPerformance();
    this.initError();
  }

  // 数据发送
  send(baseURL, data = {}) {
    data.bizID = this.bizID;
    // 如果支持 navigator.sendBeacon api则用它发送，否则用img发送数据
    if (navigator.sendBeacon) {
      return navigator.sendBeacon(baseURL, data);
    }
    let img = new Image();
    let queryStr = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
    img.src = `${baseURL}?${queryStr}`;
  }

  // 自定义事件
  event(key, val = {}) {
    let eventURL = 'http://statistic.com/event/';
    this.send(eventURL, { event: key, ...val })
  }

  // pv曝光
  pv() {
    this.event('pv')
  }

  // 点击事件
  click(target, data) {
    this.event('click', { target, ...data })
  }

  // 性能上报
  initPerformance() {
    let performanceURL = 'http://statistic.com/performance/';

    // 1.  页面首次渲染时间：`FP(firstPaint)=domLoading-navigationStart`
    // 2.  DOM加载完成：`DCL(DOMContentEventLoad)=domContentLoadedEventEnd-navigationStart`
    // 3.  图片、样式等外链资源加载完成：`L(Load)=loadEventEnd-navigationStart`
    const { domLoading, navigationStart, domContentLoadedEventEnd, loadEventEnd } = performance.timing;
    const fp = domLoading - navigationStart;
    const dcl = domContentLoadedEventEnd - navigationStart;
    const load = loadEventEnd - navigationStart;
    this.send(performanceURL, { fp, dcl, load })
  }

  // 自定义错误上报
  error(err, etraInfo = {}) {
    const errorURL = 'http://statistic.com/error/'
    const { message, stack } = err;
    this.send(errorURL, { message, stack, ...etraInfo })
  }

  // 初始化错误监控
  initError() {
    window.addEventListener('error', event => {
      this.error(error);
    })
    window.addEventListener('unhandledrejection', event => {
      this.error(new Error(event.reason), { type: 'unhandledrejection' })
    })
  }

}

