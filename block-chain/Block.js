// 块结构,为了简单，只包含必要的字段：索引(index)，时间戳(timestamp)，数据(data)，哈希(hash)和上一个哈希(previousHash)。
export default class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}
