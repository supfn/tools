import {onVisibilityChange} from 'visibility-change/index.js';

/**
 * 获取 browser 信息
 */
export function getBrowserInfo() {

  // 获取 ios 大版本号
  function getIOSVersion() {
    const version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(version[1], 10);
  }

  const ua = window.navigator.userAgent || '';
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isWx = /micromessenger\/([\d.]+)/i.test(ua);
  const isWeibo = /(weibo).*weibo__([\d.]+)/i.test(ua);
  const isQQ = /qq\/([\d.]+)/i.test(ua);
  const isQzone = /qzone\/.*_qz_([\d.]+)/i.test(ua);
  // 安卓 chrome 浏览器，很多 app 都是在 chrome 的 ua 上进行扩展的
  const isOriginalChrome = /chrome\/[\d.]+ Mobile Safari\/[\d.]+/i.test(ua) && isAndroid && ua.indexOf('Version') < 0;
  // chrome for ios 和 safari 的区别仅仅是将 Version/<VersionNum> 替换成了 CriOS/<ChromeRevision>
  // ios 上很多 app 都包含 safari 标识，但它们都是以自己的 app 标识开头，而不是 Mozilla
  const isSafari = /safari\/([\d.]+)$/i.test(ua) && isIOS && ua.indexOf('Crios') < 0 && ua.indexOf('Mozilla') === 0;
  let iOSVersion = 0;
  if (isIOS) {
    iOSVersion = getIOSVersion();
  }

  return {
    isAndroid,
    isIOS,
    isWx,
    isWeibo,
    isQQ,
    isQzone,
    isOriginalChrome,
    isSafari,
    iOSVersion
  };
}


export class EvokeAppSDK {
  /**
   *
   * @param {String}  urlScheme  app唤醒协议
   * @param {String}  appStoreLink  appStore 链接
   * @param {String}  yybLink  应用宝链接
   * @param {Number}  delay  延迟跳转时间
   * @param {String|option}  universalLink  universal 链接
   * @param {Boolean|option}  ifOpenRemindMask  在wx、qq内点唤醒是否打开提醒蒙层
   * @param {Element|option}  remindMaskElement  提醒蒙层DOM元素
   */
  constructor({ urlScheme, appStoreLink, yybLink, delay = 2000, universalLink, ifOpenRemindMask, remindMaskElement }) {
    if (!urlScheme || !appStoreLink || !yybLink) {
      throw new Error("urlScheme、appStoreLink、yybLink 为必选参数！");
    }
    this.urlScheme = urlScheme;
    this.appStoreLink = appStoreLink;
    this.yybLink = yybLink;
    this.universalLink = universalLink;
    this.ifOpenRemindMask = ifOpenRemindMask;
    this.remindMaskElement = remindMaskElement;

    this.browserInfo = getBrowserInfo();
    this.delay = delay;
    this.timer = null;
  }

  // can override by subclass
  evokeInAndroidWx() {
    if (this.ifOpenRemindMask) {
      this.OpenRemindMask();
      return;
    }
    this.toYYB();
  }

  // can override by subclass
  evokeInAndroidQQ() {
    if (this.ifOpenRemindMask) {
      this.OpenRemindMask();
      return;
    }
    this.toYYB();
  }

  // can override by subclass
  evokeInAndroidBrowser() {
    this.evokeByIFrame(this.urlScheme);
    this.setTimerGoto(this.yybLink);
  }

  // can override by subclass
  evokeInIOSWx() {
    if (this.ifOpenRemindMask) {
      this.OpenRemindMask();
      return;
    }
    this.toAppstore();
  }

  // can override by subclass
  evokeInIOSQQ() {
    if (this.ifOpenRemindMask) {
      this.OpenRemindMask();
      return;
    }
    this.toAppstore();
  }

  // can override by subclass
  evokeInIOSBrowser() {
    if (this.browserInfo.iOSVersion > 9 && this.universalLink) {
      this.evokeByTopLocation(this.universalLink);
      return;
    }
    this.evokeByIFrame(this.urlScheme);
    this.setTimerGoto(this.appStoreLink);
  }

  setTimerGoto(url) {
    this.timer = setTimeout(() => {
      this.evokeByTopLocation(url);
    }, this.delay);

    let off = onVisibilityChange((oldVisibility, newVisibility) => {
      if (oldVisibility === true && newVisibility === false) {
        this.timer && clearTimeout(this.timer);
        off();
      }
    });
  }

  OpenRemindMask() {
    if (this.ifOpenRemindMask && this.remindMaskElement) {
      // 打开蒙层
      this.remindMaskElement.style.display = 'block';
    }
  }

  toYYB() {
    this.evokeByTopLocation(this.yybLink);
  }

  toAppstore() {
    this.evokeByTopLocation(this.appStoreLink);
  }

  evoke() {
    const evokeStrategy = this.getEvokeStrategy().bind(this);
    evokeStrategy();
  }

  getEvokeStrategy() {
    const strategy = {
      ios: {
        wx: this.evokeInIOSWx,
        qq: this.evokeInIOSQQ,
        browser: this.evokeInIOSBrowser
      },
      android: {
        wx: this.evokeInAndroidWx,
        qq: this.evokeInAndroidQQ,
        browser: this.evokeInAndroidBrowser
      }
    };
    const system = this.browserInfo.isIOS ? 'ios' : 'android';
    const channel = (this.browserInfo.isWx && 'wx') || ((this.browserInfo.isQQ && 'qq')) || ('browser');
    return strategy[system][channel];
  }

  /**
   * 通过 top.location.href 跳转, 使用 top 是因为在 qq 中打开的页面不属于顶级页面，是 iframe ，自身 url 跳转无法触动唤端操作
   * @param {string} url - 需要打开的地址
   */
  evokeByTopLocation(url) {
    window.top.location.href = url;
  }

  /**
   * 通过 iframe 唤起
   * @param {string} url - 需要打开的地址
   */
  evokeByIFrame(url) {
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => document.body.removeChild(iframe);
  }
}
