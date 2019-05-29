
```javascript
// question :

// 获取页面上所有的className并去重，最终得到一个数组
```

```javascript
// solution :

function getClass() {
    let classNames = Array.from(document.querySelectorAll('[class]')).reduce( (pre, cur) => ([...pre, ...cur.classList]), [])
    return [ ...new Set(classNames) ];
}
```