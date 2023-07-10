const Router = require('./index.js')
const Server = require('../Interceptor/index.js')

const app = new Server()
const router = new Router()

// 有规则的路由中间件
app.use(
  router.all('/test/:course/:lecture', async ({ route, res }, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.body = route
    await next()
  })
)

// 无规则的路由中间件
app.use(
  router.all('.*', async ({ res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>404 Not Found</h1>'
    await next()
  })
)

app.listen({
  port: 8080,
  host: '0.0.0.0',
})
