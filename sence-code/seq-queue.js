// 设计一个简单的任务队列，要求在 1、3、4 秒后打印出 "1 2 3"

class Queue {
  constructor() {
    this.taskQueue = [];
    this.processing = false;
  }

  task(ms, cb) {
    let task = this.create(ms, cb);
    this.run(task);
    return this;
  }

  create(ms, cb) {
    const task = () => new Promise(resolve => setTimeout(resolve, ms)).then(cb);
    return task;
  }

  next() {
    if (this.taskQueue.length) {
      let task = this.taskQueue.shift();
      this.run(task);
    }
  }

  run(task) {
    if (this.processing) {
      this.taskQueue.push(task);
      return;
    }
    this.processing = true;
    task().finally(() => {
      this.processing = false;
      this.next();
    })
  }
}

function test() {
  new Queue()
    .task(1000, () => console.log(1))
    .task(2000, () => console.log(2))
    .task(1000, () => console.log(3))
}

test();