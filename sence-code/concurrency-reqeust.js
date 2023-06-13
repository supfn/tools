// 批量请求处理：ConcurrencyRequest
//
//
// 1. 批量请求处理，限制最大并发数limit。
// 2. 每当有一个请求返回，就留下一个空位，可以增加新的请求。
// 3. 所有请求完成后，结果按照urls里面的顺序依次打出。
//
class ConcurrencyRequest {
  /**
   * 
   * @param {Array[string]} urls 批量请求的url
   * @param {Number} limit 最大并发数限制
   * @param {Function} callback 结束回调
   */
  constructor(urls, limit, callback) {
    this.urls = urls;
    this.pendingTask = this.urls.map(url => () => this.fetch(url))
    this.processingTask = [];
    this.limit = limit;
    this.finishCb = callback;
    this.finishedNum = 0;
    this.reuslt = new Array(this.urls.length);  // 结果集保存
  }

  run() {
    while (this.pendingTask.length && this.processingTask.length < this.limit) {
      const task = this.pendingTask.shift();
      const idx = this.urls.length - this.pendingTask.length - 1; // 获取任务在原urls中的idx,此处已经从队头取出一个,所以要减一

      this.processingTask.push(task);
      task()
        .then(r => this.reuslt[idx] = r)
        .catch(e => this.reuslt[idx] = e)
        .finally(() => {
          this.processingTask = this.processingTask.filter(t => t !== task)
          this.finishedNum++;
          if (this.finishedNum === this.urls.length) {
            return this.finishCb(this.reuslt)
          }
          this.run();
        });
    }
  }

  add(url) {
    this.urls.push(url);
    const task = () => this.fetch(url);
    this.pendingTask.push(task);
    this.run();
  }

  // 请求处理实际根据情况具体实现
  fetch(url) {
    return fetch(url);
  }
}

// fetch请求mock
const fetch = function (idx) {
  return new Promise(resolve => {
    console.log('request: ', idx);
    const timeout = parseInt(Math.random() * 1e3);
    setTimeout(() => {
      let res = `res-${idx}`;
      console.log('response: ', res);
      resolve(res);
    }, timeout);
  });
};


// 测试代码：
function test() {
  const urls = Array.from({ length: 10 }, (v, k) => k);
  const limit = 2;
  const callback = (res) => {
    console.log('finished callback: ', res);
  };

  const cr = new ConcurrencyRequest(urls, limit, callback);
  setTimeout(() => cr.add('url'), 1500);
  cr.run();
}

test();
