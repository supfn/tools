/* eslint-disable */

class LazyProcessor {

    constructor(list = []) {
        this.list = list;
        this.length = list.length;
        this.gen = null;
        this.hasGen = false;
    }

    map(fn) {
        if (this.hasGen) {
            let its = this.gen();
            this.gen = function* () {
                for (let i = 0; i < this.length; i++) {
                    let value = its.next().value;
                    yield fn(value, i)
                }
                return true;
            };

        } else {
            this.gen = function* () {
                for (let i = 0; i < this.length; i++) {
                    yield fn(this.list[i], i)
                }
                return true;
            };
            this.hasGen = true
        }

        return this;
    }

    filter(fn) {
        if (this.hasGen) {
            let its = this.gen();
            this.gen = function* () {
                for (let i = 0; i < this.length; i++) {
                    let value = its.next().value;
                    let check = fn(value, i);
                    if (check) {
                        yield value
                    }
                }
                return true;
            }
        } else {
            this.gen = function* () {
                for (let i = 0; i < this.length; i++) {
                    let check = fn(this.list[i], i);
                    if (check) {
                        yield this.list[i];
                    }
                }
                return true;
            };
            this.hasGen = true
        }
        return this;
    }

    reduce(fn, initialValue) {
        if (this.hasGen) {
            let its = this.gen();
            for (let v of its) {
                initialValue = fn(initialValue, v)
            }
            return initialValue
        } else {
            return this.list.reduce(fn, initialValue)
        }
    }

    evaluate() {
        return this.hasGen ? Array.from(this.gen()) : this.list;
    }
}


// 相对Array.prototype.map 测试性能

console.time('lazy map');
console.log(
    new LazyProcessor([... new Array(1000000).keys()])
        .map(v => v * 10)
        .map(v => v / 10)
        .map(v => v * 10)
        .map(v => v / 10)
        .filter(v => v % 2 === 0)
        .reduce((pre, cur) => pre + cur, 0)
);
console.timeEnd('lazy map');


console.time('native map');
console.log(
    [... new Array(1000000).keys()]
        .map(v => v * 10)
        .map(v => v / 10)
        .map(v => v * 10)
        .map(v => v / 10)
        .filter(v => v % 2 === 0)
        .reduce((pre, cur) => pre + cur, 0)
);
console.timeEnd('native map');


