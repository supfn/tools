class Requset {

  static formatParams(map) {
    let arr = [];
    for (let key in map) {
      arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(map[key]));
    }
    arr.push(("_=" + (+new Date)).replace(".", ""));
    return arr.join("&");
  }

  static ajax({url, data, method = "get", successFn, failFn}) {
    let params = this.formatParams(data);
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.onreadystatechange = () => {
      if (~~xhr.readyState === 4) {
        let status = xhr.status;
        if (status >= 200 && status < 300) {
          successFn && successFn(xhr.responseText, xhr.responseXML);
        } else {
          failFn && failFn(status);
        }
      }
    };

    method = method.toUpperCase();
    if (method === "GET") {
      xhr.open("GET", `${url}?${params}`, true);
      xhr.send(null);
    } else if (method === "POST") {
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params);
    }
  }

  static jsonp({url, data, successFn, failFn, callback, timeout}) {
    if (!url || !callback) {
      throw new Error("参数不合法");
    }
    let callbackName = ('jsonp_' + (+new Date)).replace(".", "");
    data[callback] = callbackName;
    let params = this.formatParams(data);
    let script = document.createElement('script');
    document.head.appendChild(script);

    window[callbackName] = function (json) {
      document.head.removeChild(script);
      window[callbackName] = null;
      clearTimeout(script.timer);
      successFn && successFn(json);
    };

    script.src = `${url}?${params}`;

    if (timeout) {
      script.timer = setTimeout(function () {
        window[callbackName] = null;
        document.head.removeChild(script);
        failFn && failFn({message: "请求超时"});
      }, timeout);
    }
  };
}


/*
*   xhr.readyState
*   0-未初始化，尚未调用open()方法；
*   1-启动，调用了open()方法，未调用send()方法；
*   2-发送，已经调用了send()方法，未接收到响应；
*   3-接收，已经接收到部分响应数据；
*   4-完成，已经接收到全部响应数据；
*
*
* */

