/*
栈的特点:
1. 后进先出（LIFO）（先进后出）
2. 只允许操作栈顶，不能操作栈底

栈的操作:
1. 初始化栈(init、构造函数)
2. 获取栈顶元素（Top）
3. 出栈 （Pop）
4. 入栈 （Push）
5. 获取栈的长度 （Length）
6. 判断栈是否为空 （isEmpty）
7. 清空栈 （Clear）
8. 输出栈内元素 （List）

* */

class Stack {
  constructor() {
    this.stack = [];
    this.len = 0;
  }

  top() {
    return this.stack[this.len - 1];
  }

  pop() {
    this.len--;
    return this.stack.pop();
  }

  push(val) {
    this.len++;
    return this.stack.push(val);
  }

  length() {
    return this.len;
  }

  isEmpty() {
    return this.len === 0;
  }

  clear() {
    this.stack = [];
    this.len = 0;
  }

  list() {
    for (let i = this.len - 1; i >= 0; i--) {
      console.log(this.stack[i]);
    }
  }
}


export default Stack;
