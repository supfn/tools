// 1. global
(function (global, undefined) {

})(typeof self === "undefined" ? (typeof global === "undefined" ? this : global) : self);


// 2. need export
(function (factory, global) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    global.Promise = factory();
  }
})(
  function () {
    var Promise = function () {
      // Promise implement
    };
    return Promise;
  },
  this
);
