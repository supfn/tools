//观察者列表
class ObserverList {
    constructor() {
        this.observerList = [];
    }

    add(observer) {
        return this.observerList.push(observer);
    }

    count() {
        return this.observerList.length;
    }

    get(index) {
        if (index > -1 && index < this.observerList.length) {
            return this.observerList[index];
        }
    }

    indexOf(observer, startIndex) {
        let i = startIndex;
        while (i < this.observerList.length) {
            if (this.observerList[i] === observer) {
                return i;
            }
            i++;
        }
        return -1;
    }

    removeAt(index) {
        this.observerList.splice(index, 1);
    };
}

//目标
class Subject {
    constructor() {
        this.observers = new ObserverList();
    }

    addObserver(observer) {
        this.observers.add(observer);
    }

    removeObserver(observer) {
        this.observers.removeAt(this.observers.indexOf(observer, 0));
    }

    notify(context) {
        let observerCount = this.observers.count();
        for (let i = 0; i < observerCount; i++) {
            this.observers.get(i).update(context);
        }
    }
}

//观察者
class Observer {
    constructor() {

    }

    update() {
        throw new Error('must be implement in subclass ！');
    }
}