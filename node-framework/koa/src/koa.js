const http = require('http');

const Context = require('./context')

class Koa {

  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {

      // 创建上下文
      const ctx = this.createContext(req, res)

      // 使用 compose 合成所有中间件，在中间件中会做一些
      // 1. 路由解析
      // 2. Body解析
      // 3. 异常处理
      // 4. 统一认证
      // 5. 等等...
      const fn = this.compose(this.middlewares)

      try {
        await fn(ctx)
      } catch (e) {
        // 最基本的异常处理函数，在实际生产环境中，将由一个专业的异常处理中间件来替代，同时也会做
        // 1. 确认异常级别
        // 2. 异常上报
        // 3. 构造与异常对应的状态码，如 429、422 等
        console.error(e)
        ctx.res.statusCode = 500
        ctx.res.end('Internel Server Error')
      }

      // 响应
      res.end(ctx.body)
    })

    server.listen(...args)
  }


  /**
   * koa 为了能够简化 API，引入了上下文 context 的概念，
   * 将原始的请求对象 req 和响应对象 res 封装并挂载到了 context 上，
   * 并且设置了 getter 和 setter ，从而简化操作
  */
  createContext(req, res) {
    const ctx = new Context(req, res);
    return ctx;
  }

  compose(middlewares) {
    return ctx => {
      const dispatch = (i) => {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }
        const next = () => dispatch(i + 1);
        return Promise.resolve(fn(ctx, next))
      }
      return dispatch(0)
    }
  }
}

module.exports = Koa