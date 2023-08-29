// 题目：完成沙箱 SandBox 的代码编写， 使其通过下面的测试代码
// class SandBox {
//   activate(){
//   }
//   inactivate(){
//   }
// }

function test() {
  window.data = 'window-data';
  const sandbox = new SandBox();
  sandbox.activate();
  window.sandboxData = 'sandbox-data';
  console.log(window.data, window.sandboxData); // 输出: window-data sandbox-data

  sandbox.inactivate();
  console.log(window.data, window.sandboxData); // 输出: window-data undefined

  window.data2 = 'window-data2';
  sandbox.activate();
  window.sandboxData2 = 'sandbox-data-2';
  console.log(window.data, window.data2, window.sandboxData, window.sandboxData2); // 输出: window-data window-data2 sandbox-data sandbox-data-2

  sandbox.inactivate();
  console.log(window.data, window.data2, window.sandboxData, window.sandboxData2); // 输出: window-data window-data2 undefined undefined
}
test();

class SandBox {
  constructor() {
    this.originWindow = {};
    this.diffMap = {};
  }

  activate() {
    this.originWindow = {};
    for (let key of Object.keys(window)) {
      // 保存初始 window 对象
      this.originWindow[key] = window[key];
    }
    for (let key of Object.keys(this.diffMap)) {
      // 恢复快照，将上次退出的时保存的差异还原
      window[key] = this.diffMap[key];
    }
  }

  inactivate() {
    for (let key of Object.keys(window)) {
      if (window[key] !== this.originWindow[key]) {
        // 保存差异
        this.diffMap[key] = window[key];
        // 还原现场
        window[key] = this.originWindow[key];
      }
    }
  }
}


