//实现一个LazyMan，可以按照以下方式调用:
//   LazyMan("Hank") 输出:
//   Hi! This is Hank!
//
//   LazyMan("Hank").sleep(10).eat("dinner") 输出:
//   Hi! This is Hank!
//   等待10秒...
//   Wake up after 10
//   Eat dinner~
//
//   LazyMan("Hank").eat("dinner").eat("supper") 输出:
//   Hi This is Hank!
//   Eat dinner~
//   Eat supper~
//
//   LazyMan("Hank").sleepFirst(5).eat("supper") 输出:
//   等待5秒...
//   Wake up after 5
//   Hi This is Hank!
//   Eat supper
//
// 以此类推。
//


function LazyMan(name) {
  if (!(this instanceof LazyMan)) {
    return new LazyMan(name);
  }
  this._taskQueue = [];
  let f = () => {
    console.log(`hello, ${name}`);
    this.next();
  };
  this._taskQueue.push(f);
  setTimeout(this.next.bind(this), 0);
}
LazyMan.prototype = {
  next() {
    if (this._taskQueue.length) {
      let task = this._taskQueue.shift();
      task();
    }
  },
  sleep(ms) {
    let f = () => setTimeout(this.next.bind(this), ms);
    this._taskQueue.push(f);
    return this;
  },
  eat(something) {
    let f = () => {
      console.log(`eat ${something}`);
      this.next();
    };
    this._taskQueue.push(f);
    return this;
  },
  sleepFirst(ms) {
    let f = () => setTimeout(this.next.bind(this), ms);
    this._taskQueue.unshift(f);
    return this;
  },
};

LazyMan("Hank").sleepFirst(2000).eat("supper").sleep(1000).eat("dinner");
