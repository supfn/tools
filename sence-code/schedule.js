class Scheduler {
  constructor() {
    this.limit = 2;
    this.processingNum = 0;
    this.pendingTask = [];
  }

  add(fn) {
    let task = {};

    task.promise = new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
    });
    task.fn = fn;

    return this.run(task);
  }

  run(task) {
    if (this.processingNum === this.limit) {
      this.pendingTask.push(task);
      return task.promise;
    }
    this.processingNum++;
    task.fn()
      .then(data => {
        task.resolve(data)
      })
      .catch(e => task.reject(e))
      .finally(() => {
        this.processingNum--;
        // 继续取任务执行
        const task = this.get();
        if (task) {
          this.run(task);
        }
      })
    return task.promise;
  }

  get() {
    let task = null;
    if (this.pendingTask.length) {
      task = this.pendingTask.shift();
    }
    return task;
  }
}


const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(400, 4)
addTask(200, 2)
addTask(400, 3)
addTask(100, 1)
//2 4 1 3

