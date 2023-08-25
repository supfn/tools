/*
// 题目: 实现一个请求错误重试函数 fetchWithRetry; 最多自动重试 retry 次，重试延时 timeout ms，任意一次成功就直接返回，返回结果为promsie
function fetchWithRetry(retry, timeout){
}
*/


/**
 * @param {number} retry 重试次数
 * @param {number} timeout 重试延迟时间
 * @returns {Promise}
 */
function fetchWithRetry(retry = 3, timeout = 800) {

  let promiseWrap = {
    promise: null,
    reoslve: () => { },
    reject: () => { }
  }

  promiseWrap.promise = new Promise((reoslve, reject) => {
    promiseWrap.reoslve = reoslve;
    promiseWrap.reject = reject;
  })


  const retryAction = () => {
    fetch
      .then(promiseWrap.reoslve)
      .catch(e => {
        retry--;
        if (retry > 0) {
          setTimeout(retryAction, timeout);
        } else {
          promiseWrap.reject(e);
        }
      });
  }

  retryAction();

  return promiseWrap.promise;
} 
