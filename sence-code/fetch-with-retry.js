// 实现一个请求函数：fetchWithRetry，要求会最多自动重试 3 次，任意一次成功就直接返回

function fetchWithRetry(retry = 3, timeout = 800) {

  let p = {
    promise: null,
    reoslve: () => { },
    reject: () => { }
  }

  p.promise = new Promise((reoslve, reject) => {
    p.reoslve = reoslve;
    p.reject = reject;
  })


  const retryAction = () => {
    fetch
      .then(p.reoslve)
      .catch(e => {
        retry--;
        if (retry > 0) {
          setTimeout(retryAction, timeout);
        } else {
          p.reject(e);
        }
      });
  }

  retryAction();

  return p.promise;
} 