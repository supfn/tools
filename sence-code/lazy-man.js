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
  this.taskQueue = [];
  let f = () => Promise.resolve().then(() => console.log(`hello, ${name}`));
  this.taskQueue.push(f);
  setTimeout(this.execute.bind(this), 0);
}

LazyMan.prototype = {
  sleep: function (ms) {
    let f = () => new Promise(resolve => setTimeout(resolve, ms));
    this.taskQueue.push(f);
    return this;
  },
  eat: function (something) {
    let f = () => Promise.resolve().then(() => console.log(`eat ${something}`));
    this.taskQueue.push(f);
    return this;
  },
  sleepFirst: function (ms) {
    let f = () => new Promise(resolve => setTimeout(resolve, ms));
    this.taskQueue.unshift(f);
    return this;
  },
  execute: function () {
    this.taskQueue.reduce((pre, next) => pre.then(next), Promise.resolve());
  }
};

LazyMan("Hank").sleepFirst(2000).eat("dinner").sleep(1000).eat("supper");
