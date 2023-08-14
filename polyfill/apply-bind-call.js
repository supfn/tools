/*
// 要实现这个效果
var foo ={
  value:1
}
function bar(){
  console.log(this.value)
}
bar.call(foo);//1

// 相当于做如下事情
var foo = {w
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};
foo.bar(); // 1
*/
Function.prototype._call = function (ctx, ...args) {
  let fn = this;
  ctx = ctx || window;
  ctx.fn = fn;
  let result = ctx.fn(...args);
  delete ctx.fn;
  return result;
};


Function.prototype._apply = function (ctx, args) {
  let fn = this;
  ctx = ctx || window;
  ctx.fn = fn;
  let result = ctx.fn(...args);
  delete ctx.fn;
  return result;
};

Function.prototype._bind = function (ctx, args) {
  let fn = this;

  let F = function () { };
  let bound = function (...args2) {
    const mergedArgs = args.concat(args2);
    fn.apply(F.prototype.isPrototypeOf(this) ? this : ctx, mergedArgs);
  };
  if (fn.prototype) {
    F.prototype = fn.prototype;
  }
  bound.prototype = new F();

  return bound;
};
