/**
 * ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
 */
class ES6Set {
  constructor(iterator) {
    this._set = [];
    if (iterator && iterator[Symbol.iterator]) {
      for (let item of iterator) {
        this.add(item)
      }
    }
  }

  get size() {
    return this._set.length;
  }

  add(value) {
    let index = this._set.indexOf(value);
    if (index !== -1) {
      this._set.push(value)
    }
    return this;
  }

  delete(value) {
    try {
      let index = this._set.indexOf(value);
      this._set.splice(index, 1);
      return true;
    } catch (e) {
      return false;
    }
  }

  has(value) {
    return this._set.indexOf(value) !== -1;
  }

  clear(value) {
    this._set = [];
  }

  keys() {
    return this._set;
  }

  values() {
    return this._set;
  }

  entries() {
    return this._set.map(value => [value, value]);
  }

  forEach(cb, ctx) {
    this._set.forEach(value => cb.call(ctx, value, value, this));
  }
}
