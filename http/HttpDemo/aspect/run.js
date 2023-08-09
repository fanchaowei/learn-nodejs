const Router = require('../Router/index.js')
const Server = require('../Interceptor/index.js')
const param = require('./param.js')

const router = new Router()
const app = new Server()

// 仅提供 log，通知用户访问了哪个 url
app.use(async ({ req, res }, next) => {
  console.log(`${req.method}${req.url}`)
  await next()
})

// 解析 get 请求的参数
app.use(param)

// 返回数据
app.use(
  router.get('/coronavirus/index', async ({ route, res }, next) => {
    const { getCoronavirusKeyIndex } = require('../module/mock.js')
    const index = getCoronavirusKeyIndex()
    res.setHeader('Content-Type', 'application/json')
    res.body = { data: index }
    await next()
  })
)

// 返回对应日期的数据
app.use(
  router.get('/coronavirus/:date', async ({ route, res }, next) => {
    const { getCoronavirusByDate } = require('../module/mock.js')
    const data = getCoronavirusByDate(route.date)
    res.setHeader('Content-Type', 'application/json')
    res.body = { data }
    await next()
  })
)

// 默认路由，返回 404
app.use(
  router.all('.*', async ({ params, req, res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>Not Found</h1>'
    res.statusCode = 404
    await next()
  })
)

app.listen({
  port: 8080,
  host: '0.0.0.0',
})
