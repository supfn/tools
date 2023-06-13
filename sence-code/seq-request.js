// 可控时序请求，请求分为2类 biz(业务请求) 与 track(埋点请求)； 
// 请求并发数为5，要求 biz 请求优先于 track 请求
//
// seqRequest
//
//
//

const fetch = function (params) {
  return new Promise(resolve => {
    console.log('request params: ', params);
    const timeout = parseInt(Math.random() * 1e3);
    setTimeout(() => {
      console.log('response: ', `res: ${params}`);
      resolve(`res: ${params}`);
    }, timeout);
  });
};

class SeqRequest {
  static bizQueue = [];
  static trackQueue = [];
  static limit = 5; // 限制并发数量
  static requesttingNums = 0;

  static fetch(params) {
    this.requesttingNums++;
    return fetch(params)
      .then(res => res)
      .catch(e => e)
      .finally(() => {
        this.requesttingNums--;
        this.poll()
      })
  }

  static request(params) {
    if (this.requesttingNums < this.limit) {
      return this.fetch(params);
    }
    const type = params.type;
    if (type === 'biz') {
      const queueData = { params }
      queueData.promise = new Promise((resolve, reject) => {
        queueData.resolve = resolve;
        queueData.reject = reject;
      })
      this.bizQueue.push(queueData);
      return queueData.promise;
    }
    if (type === 'track') {
      const queueData = { params }
      queueData.promise = new Promise((resolve, reject) => {
        queueData.resolve = resolve;
        queueData.reject = reject;
      })
      this.trackQueue.push(queueData);
      return queueData.promise;
    }
  }

  static poll() {
    if (this.bizQueue.length) {
      const queueData = bizQueue.shift();
      return this.fetch(queueData.params)
        .then(queueData.resolve)
        .catch(queueData.reject)
    } else if (this.trackQueue.length) {
      const queueData = this.trackQueue.shift();
      return this.fetch(queueData.params)
        .then(queueData.resolve)
        .catch(queueData.reject)
    }
  }
}



// 调用例子
SeqRequest.request({
  type: 'biz',
  url: '',
  data: {},
  header: {},
  succeess: () => { },
  fail: () => { }
})