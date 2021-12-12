// 判断输出结果
// function Foo() {
//   getName = function() { console.log(1); };
//   return this;
// }
//
// Foo.getName = function() { console.log(2);};
//
// Foo.prototype.getName = function() { console.log(3);};
//
// var getName = function() { console.log(4);};
//
// function getName() { console.log(5);}
//`
// Foo.getName(); // 2
// getName(); // 4
// Foo().getName(); // 1  宽松模式下指向window, 严格模式报错
// getName(); // 1
// new Foo.getName(); // 2
// new Foo().getName(); // 3



//现在有一个英文单词输入框，需要提供一个单词提示功能，比如用户输入 "hell"
// 能够最多列出3个以 "hell" 开头的单词:"hello"、"hellbent"、"hellboy"。
// 假设提示单词包含整本英文词典，设计一个数据结构存储这些单词，
// 查找一个单词的时间复杂度小于O(n) （字典树）



//算法：64个人，8个赛道，每次赛跑没有计时只有顺序，如何最快找出跑得最快的4个人。


// 2.实现一个异步调度器，按时间打印出id
//
// var s = new Scheduler()
// s.addLogTask(700 /* 延时毫秒数 */, 1 /* 需要log出来的id */);
// s.addLogTask(1000, 2);
// s.addLogTask(200, 3);
// s.addLogTask(500, 4);
// s.run(2 /* 最大并行任务数 */);



