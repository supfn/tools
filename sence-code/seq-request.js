/**
 * 可控时序请求，请求分为2类 biz(业务请求) 与 track(埋点请求)，要求biz优先于track
 * 请求并发数为5，要求 biz 请求优先于 track 请求
 */
class SeqRequest {
  static bizQueue = [];
  static trackQueue = [];
  static limit = 5; // 限制并发数量
  static requesttingNums = 0;

  request(params) {
    let task = this.createTask(params);
    return this.runTask(task);
  }

  createTask(params) {
    let task = {};
    task.promise = new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
    })
    task.params = params;
    return task;
  }

  runTask(task) {
    if (this.requesttingNums < this.limit) {
      this.requesttingNums++;
      let promise = this.fetch(task.params);
      promise
        .then(data => task.resolve(data))
        .catch(e => task.catch(e))
        .finally(() => {
          this.requesttingNums--;
          this.nextTask();
        });
      return promise;
    }

    if (task.params.type === 'biz') {
      this.bizQueue.push(task);
    }

    if (task.params.type === 'track') {
      this.trackQueue.push(task);
    }

    return task.promise;
  }

  nextTask() {
    let task;
    if (this.bizQueue.length) {
      task = this.bizQueue.shift();
    } else if (this.trackQueue.length) {
      task = this.trackQueue.shift();
    } else {
      return;
    }
    this.runTask(task);
  }

  fetch(params) {
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
    return fetch(params);
  }
}



// 调用例子
function test() {
  let seqRequest = new SeqRequest();
  seqRequest.request({
    type: 'biz',
    url: '',
    data: {},
    header: {},
    succeess: () => { },
    fail: () => { }
  })
}
test();