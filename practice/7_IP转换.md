
```javascript
/*
 quetion :
一个 IP 比如 128.32.10.1，我们能变成二进制：

128: 10000000
32: 00100000
10: 00001010
1: 00000001
把它们黏起来就变成了 10000000001000000000101000000001，变成十进制就是 2149583361。

所以我们要做的是给你类似于 2149583361 这么个数字，你给还原成 IP。
*/

function int32ToIp(int32) {
    //...
}

int32ToIp(2149583361); //< "128.32.10.1"
```

```javascript
// solution 1:

function int32ToIp(int32) {
    return int32.toString(2).match(/\d{8}/g).map(function(s) {
        return parseInt(s, 2);
    }).join(".");
}
```

```javascript
// solution 2:

function int32ToIp(int32) {
    return [ int32 / 2 >> 23, (int32 / 2 >> 15) % 256, (int32 / 2 >> 7) % 256, int32 % 256 ].join(".");
}
```

```javascript
// solution 3:
function int32ToIp(a){return[a/2>>23,(a/2>>15)%256,(a/2>>7)%256,a%256].join(".")}
```