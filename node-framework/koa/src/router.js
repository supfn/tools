/**
 * 路由的原理就是根据地址和方法，调用相对应的函数即可
 * 其核心就是要利用一张表，记录下注册的路由和方法
 */

class Router {
  constructor() {
    this.stacks = [];
  }

  register(path, method, middleware) {
    this.stacks.push({
      path, method, middleware
    })
  }

  get(path, middleware) {
    this.register(path, 'get', middleware)
  }

  post(path, middleware) {
    this.register(path, 'post', middleware)
  }

  routes() {
    return async (ctx, next) => {
      let url = ctx.url === '/index' ? '/' : ctx.url
      let method = ctx.method
      let route

      for (let i = 0; i < this.stacks.length; i++) {
        let item = this.stacks[i]
        if (item.path === url && item.method === method) {
          route = item.middleware
          break
        }
      }

      if (typeof route === 'function') {
        await route(ctx, next)
        return
      }

      await next()
    }
  }
}

module.exports = Router