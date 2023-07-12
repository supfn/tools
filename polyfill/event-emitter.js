class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, cb) {
    let callbacks = this.listeners[event] || [];
    if (callbacks.indexOf(cb) === -1) {
      callbacks.push(cb);
    }
    this.listeners[event] = callbacks;
  }

  emit(event, ...args) {
    let callbacks = this.listeners[event] || [];
    callbacks.forEach(cb => {
      cb(...args);
    })
  }

  off(event, cb) {
    let callbacks = this.listeners[event] || [];
    if (cb) {
      let index = callbacks.indexOf(cb);
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    } else {
      this.listeners[event] = [];
    }
  }

  once(event, cb) {
    this.on(event, (...args) => {
      cb(...args);
      this.off(event, cb);
    })
  }

}

// TODO: test function