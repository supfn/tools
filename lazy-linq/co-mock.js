/* eslint-disable */

let co = require('co');


function cool(gen) {
    return new Promise(function (resolve, reject) {
        var iter = typeof gen === 'function' ? gen() : gen;

        function onResolve(data) {
            try {
                var it = iter.next(data); // 进行一步迭代
                step(it);
            } catch (ex) {
                reject(ex); // 捕获到generator function内的异常，终止迭代
            }
        }

        function onReject(err) {
            try {
                var it = iter.throw(err);
                // 将yield表达式中的异步操作的错误抛进generator function，并继续迭代
                step(it);
            } catch (ex) {
                reject(ex); // generator function没有妥善处理异常，终止迭代
            }
        }

        function step(it) {
            if (it.done) {
                // 迭代已完成
                resolve(it.value);
                return;
            }
            var value = it.value;
            if (typeof value.then === 'function') {
                // 收到的是一个Promise
                value.then(onResolve, onReject);
            } else if (typeof value.next === 'function' && typeof value.throw === 'function') {
                // 收到的是一个Generator，将其用cool包装为一个Promise然后继续
                cool(value).then(onResolve, onReject);
            } else {
                // 收到的是一个值
                onResolve(value);
            }
        }

        onResolve(); // 开始迭代
    });
}

function sleepRandom() {
    return new Promise(function (resolve) {
        var ms = Math.floor(Math.random() * 500 + 500);
        setTimeout(resolve.bind(this, ms), ms); // Promise的返回值就是sleep的毫秒数
    });
}


function* boring() {
    for (var i=0; i<5; ++i) {
        var ms = yield sleepRandom();
        console.log('boring', ms);
    }
    return 'boring end';
}
var boringJob = cool(function*(){
    var boringResult = yield boring(); // 一个generator function里可以yield另一个generator
    console.log('boring result:', boringResult);
    return 'success';
});
boringJob.then(function(data) {
    console.log('finished:', data);
}, function(err) {
    console.log('failed:', err);
});


function countDown(timestamp = 46400) {
    var ONE_MIN = 60;
    var ONE_HOUR = 60 * 60;
    var ONE_DAY = 60 * 60 * 24;
    var result = {};
    result.day = parseInt(timestamp / ONE_DAY);
    result.hour = parseInt((timestamp % ONE_DAY) / ONE_HOUR);
    result.min = parseInt((timestamp % ONE_HOUR) / ONE_MIN);
    result.second = timestamp % ONE_MIN;
    return result;
}




