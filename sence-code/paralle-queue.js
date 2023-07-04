class ParallelQueue {
  constructor(options) {
    this.limit = options.limit;
    this.fetch = options.request;
    this.pendingTask = [];
    this.processingTask = [];
  }

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
    if (this.processingTask.length < this.limit) {
      this.processingTask.push(task);
      let promise = this.fetch(task.params);
      promise
        .then(data => task.resolve(data))
        .catch(e => task.catch(e))
        .finally(() => {
          this.processingTask = this.processingTask.filter(t => t !== task);
          this.nextTask();
        });
      return promise;
    }

    this.pendingTask.push(task);
    return task.promise;
  }

  nextTask() {
    if (this.pendingTask.length) {
      let task = this.pendingTask.shift();
      this.runTask(task);
    }
  }
}


function test() {
  const get = () => new Promise(r => setTimeout(r, 1000, Math.random()));
  const request = new ParallelQueue({
    limit: 3,
    request: get,
  });
  Promise.all(
    new Array(10).fill(null).map(
      (params, idx) => request.request(params).then(data => {
        console.log(`${idx}:`, data);
        return data;
      })
    )
  )
    .then(data => console.log(data))
    .finally(() => console.log('all request done!'));
}

test();
