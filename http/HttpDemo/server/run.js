const Server = require('../Interceptor/index.js')
const Router = require('../Router/index.js')

const app = new Server()
const router = new Router()

app.use(async (ctx, next) => {
  console.log(`visit ${ctx.req.url} through worker: ${app.worker.process.pid}`)
  await next()
})

// 统计访问次数
app.use(async (ctx, next) => {
  // 向主进程发送消息
  process.send('count')
  await next()
})

let count = 0
process.on('message', (msg) => {
  // 处理由主线程 worker.send 发送来的信息
  if (msg === 'count') {
    count++
    console.log(`visit count ${count}`)
  }
})

app.use(
  router.all('.*', async ({ req, res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>Hello world</h1>'
    await next()
  })
)

app.listen({
  port: 8080,
  host: '0.0.0.0',
})
