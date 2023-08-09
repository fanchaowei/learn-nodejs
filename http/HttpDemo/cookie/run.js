const Router = require('../Router/index.js')
const Server = require('../Interceptor/index.js')
const { getHttpCookie } = require('./utils.js')

const router = new Router()
const app = new Server()

const users = {}

app.use(getHttpCookie)
app.use(
  router.get('/', async ({ cookies, route, res }, next) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    let id = cookies.interceptor_js
    if (id) {
      users[id] = users[id] || 1
      users[id]++
      res.body = `<h1>你好，欢迎第${users[id]}次访问本站</h1>`
    } else {
      id = Math.random().toString(36).slice(2)
      users[id] = 1
      res.body = '<h1>你好，新用户</h1>'
    }
    res.setHeader('Set-Cookie', `interceptor_js=${id}; Max-Age=86400`)
    await next()
  })
)

app.listen({
  port: 8080,
  host: '0.0.0.0',
})
