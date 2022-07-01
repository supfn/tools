function* _filter(iterable, predicate) {
    for (let item of iterable) {
        let check = predicate(item);
        if (check) {
            yield item;
        }
    }
}

function* _map(iterable, mapper) {
    for (let item of iterable) {
        let mapped = mapper(item);
        yield mapped;
    }
}

class Queryable {
    constructor(iterable) {
        this.iterable = iterable
    }

    [Symbol.iterator]() {
        let iterator = this.iterable[Symbol.iterator]();
        return iterator;
    }

    map(mapper) {
        let iterable = _map(this, mapper);
        return new Queryable(iterable)
    }

    filter(predicate) {
        let iterable = _filter(this, predicate);
        return new Queryable(iterable)
    }

    reduce(reducer, initial) {
        let result = initial;
        for (let item of this) {
            result = reducer(result, item);
        }
        return result;
    }

    get length() {
        return this.reduce(n => n + 1, 0)
    }

    toArray() {
        return [... this]
    }
}


module.exports = Queryable;

