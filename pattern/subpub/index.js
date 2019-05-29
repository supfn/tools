
class PubSub {
    constructor() {
        // Storage for topics that can be broadcast or listened to
        this.topics = {};

        // An topic identifier
        this.subUid = -1;
    }

    // Publish or broadcast events of interest with a specific topic name and arguments
    // such as the data to pass along
    publish(topic, args) {
        if (!this.topics[topic]) {
            return false;
        }
        let subscribers = this.topics[topic],
            len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func(topic, args);
        }
        return this;
    };

    // Subscribe to events of interest with a specific topic name and a callback function,
    // to be executed when the topic/event is observed
    subscribe(topic, func) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        let token = (++this.subUid).toString();
        this.topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };

    // Unsubscribe from a specific topic, based on a tokenized reference to the subscription
    unsubscribe(token) {
        for (let m in this.topics) {
            if (this.topics[m]) {
                for (let i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].token === token) {
                        this.topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return this;
    };
}