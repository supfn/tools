'use strict';
let cryptoJS = require("crypto-js");
let express = require("express");
let bodyParser = require('body-parser');
let WebSocket = require("ws");
let Block = require("./Block.js");

let http_port = process.env.HTTP_PORT || 3001;
let p2p_port = process.env.P2P_PORT || 6001;
let initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

let sockets = [];
let MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCK_CHAIN: 2
};

// 使用Javascript数组存储区块链。区块链的第一个区块也叫“创世纪块（genesis-block，区块链中的第一个块）”，它是直接写死的。
let getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

let blockChain = [getGenesisBlock()];

// 用于控制节点（HTTP服务器）
let initHttpServer = () => {
    let app = express();
    app.use(bodyParser.json());

    // 列出所有的块
    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockChain)));

    // 用户给出的内容创建一个新块
    app.post('/mineBlock', (req, res) => {
        let newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });

    // 列出节点
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    // 添加节点
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};


// 用于节点之间的点对点通信（Websocket HTTP服务器）。
let initP2PServer = () => {
    let server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('listening websocket p2p port on: ' + p2p_port);

};

let initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
};

let initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        let message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCK_CHAIN:
                handleBlockChainResponse(message);
                break;
        }
    });
};

let initErrorHandler = (ws) => {
    let closeConnection = (ws) => {
        console.log('connection failed to peer: ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};


// 要创建一个块，我们必须知道上一个块的哈希，并创建剩余的所需内容（=索引，哈希，数据和时间戳）。块数据是由终端用户提供。
let generateNextBlock = (blockData) => {
    let previousBlock = getLatestBlock();
    let nextIndex = previousBlock.index + 1;
    let nextTimestamp = new Date().getTime() / 1000;
    let nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

// 该块需要被哈希运算以保持数据的完整性。SHA-256被用来做哈希算法处理块的内容
let calculateHashForBlock = (block) => {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};

//
let calculateHash = (index, previousHash, timestamp, data) => {
    return cryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

let addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockChain.push(newBlock);
    }
};

// 在任何时候，我们必须能够验证块或区块链的完整性。特别是当我们从其他节点接收到新块时，并且必须决定是否接受它们。
let isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

let connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        let ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('connection failed')
        });
    });
};

let handleBlockChainResponse = (message) => {
    let receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    let latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    let latestBlockHeld = getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("We can append the received block to our chain");
            blockChain.push(latestBlockReceived);
            broadcast(responseLatestMsg());
        } else if (receivedBlocks.length === 1) {
            console.log("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        } else {
            console.log("Received block-chain is longer than current blockChain");
            replaceChain(receivedBlocks);
        }
    } else {
        console.log('received block-chain is not longer than current blockChain. Do nothing');
    }
};

// 任意时间，链中应始终只有一组块。如果发生冲突，我们选择具有最长块数的链。
let replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockChain.length) {
        console.log('Received blockChain is valid. Replacing current blockChain with received blockChain');
        blockChain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockChain invalid');
    }
};

let isValidChain = (blockChainToValidate) => {
    if (JSON.stringify(blockChainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    let tempBlocks = [blockChainToValidate[0]];
    for (let i = 1; i < blockChainToValidate.length; i++) {
        if (isValidNewBlock(blockChainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockChainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

let getLatestBlock = () => blockChain[blockChain.length - 1];
let queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
let queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
let responseChainMsg = () => ({
    'type': MessageType.RESPONSE_BLOCK_CHAIN, 'data': JSON.stringify(blockChain)
});
let responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCK_CHAIN,
    'data': JSON.stringify([getLatestBlock()])
});

let write = (ws, message) => ws.send(JSON.stringify(message));
let broadcast = (message) => sockets.forEach(socket => write(socket, message));

connectToPeers(initialPeers);
initHttpServer();
initP2PServer();
