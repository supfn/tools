const Koa = require('./src/koa')
const app = new Koa()

const Router = require('./src/router')
const router = new Router()

router.get('/', async ctx => { ctx.body = 'index page' })
router.get('/home', async ctx => { ctx.body = 'home page' })
router.post('/', async ctx => { ctx.body = 'post index' })
app.use(router.routes())

// const delay = () => new Promise(resolve => setTimeout(() => resolve(), 2000))
// app.use(async (ctx, next) => {
//   ctx.body = "1"
//   await next()
//   ctx.body += "5"
// })
// app.use(async (ctx, next) => {
//   ctx.body += "2"
//   await delay()
//   await next()
//   ctx.body += "4"
// })
// app.use(async (ctx, next) => {
//   ctx.body += "3"
// })

app.listen(3000, () => {
  console.log('server started at port 3000')
})