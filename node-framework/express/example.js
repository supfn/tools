const express = require('./index')

const app = express()
const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

app.get('/wait', (req, res) => {
  sleep(3000).then(() => res.end('hello, world'))
})

app.use('/api',
  (req, res, next) => {
    // 应用中间件 A
    console.log('Application Level Middleware: A')
    next()
  },
  (req, res, next) => {
    // 应用中间件 B
    console.log('Application Level Middleware: B')
    next()
  }
)

app.get('/api',
  (req, res, next) => {
    // 路由中间件 C
    console.log('Route Level Middleware: C')
    next()
  },
  (req, res, next) => {
    // 路由中间件 D
    console.log('Route Level Middleware: D')
    res.end('hello, world')
  }
)

app.get('/api/users/:id', (req, res) => {
  res.end(JSON.stringify({ userId: req.params.id }))
})

app.listen(3000, () => console.log('Listening 3000'))