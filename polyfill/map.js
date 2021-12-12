/**
 * Map 类似于对象(Object)，也是键值对的集合，
 * 但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键
 * 缺陷是访问的时间复杂度不再是O(1)，而是O(n)。
 */

class ES6Map {
  constructor(iterator) {
    this._keys = [];
    this._values = [];
    if (iterator && iterator[Symbol.iterator]) {
      for (let item of iterator) {
        this.set(item[0], item[1]);
      }
    }
  }

  get size() {
    return this._keys.length;
  }

  set(key, value) {
    let index = this._keys.indexOf(key);
    if (index === -1) {
      this._keys.push(key);
      this._values.push(value);
    } else {
      this._values[index] = value;
    }
    return this;
  }

  get(key) {
    let index = this._keys.indexOf(key);
    return index === -1 ? undefined : this._values[index];
  }

  has(key) {
    let index = this._keys.indexOf(key);
    return index !== -1;
  }

  delete(key) {
    try {
      let index = this._keys.indexOf(key);
      this._keys.splice(index, 1);
      this._values.splice(index, 1);
      return true;
    } catch (e) {
      return false;
    }
  }

  clear() {
    this._keys = [];
    this._values = [];
  }

  keys() {
    return this._keys;
  }

  values() {
    return this._values;
  }

  entries() {
    return this._keys.map((key, index) => [key, this._values[index]]);
  }

  forEach(cb, ctx) {
    this._keys.forEach((value, index) => {
      cb.call(ctx, this._values[index], value, this);
    });
  }
}

(function test() {
  const m = new ES6Map();
  const o = {p: 'Hello World'};

  m.set(o, 'content');
  console.log(m.get(o)); // "content"
  console.log(m.has(o)); // true
  m.set(o, 'others');
  console.log(m.get(o)); // "others"

  console.log(m.get({})); // undefined

  let k1 = ['a'];
  m.set(k1, 555);
  console.log(m.get(k1)); // undefined
  console.log(m.get(['a'])); // undefined

  console.log(m.size); // 2

  console.log(m.keys());  // [ { p: 'Hello World' }, [ 'a' ] ]
  console.log(m.values());  // [ 'others', 555 ]
  console.log(m.entries()); // [ [ { p: 'Hello World' }, 'others' ], [ [ 'a' ], 555 ] ]

  console.log(m.delete(o)); // true
  console.log(m.has(o)); // false

})();
