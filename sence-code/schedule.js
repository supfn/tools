// 设计一个简单的异步任务队列执行器，要求执行并发数为 2
class Scheduler {
  constructor() {
      this.limit = 2;
      this.processingNum = 0;
      this.pendingTask = [];
  }

  createTask(fn) {
      let task = {};

      task.promise = new Promise((resolve, reject) => {
          task.resolve = resolve;
          task.reject = reject;
      });
      task.fn = fn;

      return task;
  }

  runTask(task) {
      if (this.processingNum === this.limit) {
          this.pendingTask.push(task);
          return task.promise;
      }

      this.processingNum++;
      task.fn()
          .then(data => task.resolve(data))
          .catch(e => task.reject(e))
          .finally(() => {
              this.processingNum--;
              this.next()
          })

      return task.promise;
  }

  run(fn){
    const task = this.createTask(fn);
    return this.runTask(task);
  }

  next() {
      if (this.pendingTask.length) {
          const task = this.pendingTask.shift();
          return this.runTask(task);
      }
  }
}

function test() {
  const generatePromise = (time, data) => new Promise(resolve => setTimeout(resolve, time, data));
  const scheduler = new Scheduler();

  scheduler.run(() => generatePromise(400,4)).then(data=>console.log(data));
  scheduler.run(() => generatePromise(200,2)).then(data=>console.log(data));
  scheduler.run(() => generatePromise(400,3)).then(data=>console.log(data));
  scheduler.run(() => generatePromise(100,1)).then(data=>console.log(data));
}

test(); // 打印: 2 4 1 3
