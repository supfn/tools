/*
队列的特点：
1. 先进先出（FIFO）
2. 队尾插入，队头删除

队列的操作：
1. 初始化（构造函数、init）
2. 入队（EnQueue）
3. 出队（DeQueue）
4. 队头元素（Top）
5. 长度（Length）
6. 判断队是否为空（QueueEmpty）
7. 输出队内元素（List）
8. 清空队列（ClearQueue）
* */

class Queue {
  constructor() {
    this.queue = [];
    this.len = [];
  }

  enQueue(val) {
    this.len++;
    this.queue.push(val);
  }

  deQueue() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  length() {
    return this.len;
  }

  queueEmpty() {
    return this.len === 0;
  }

  list() {
    for (let i = 0; i < this.len; i++) {
      console.log(this.queue[i]);
    }
  }

  clearQueue() {
    this.queue = [];
    this.len = 0;
  }

}
