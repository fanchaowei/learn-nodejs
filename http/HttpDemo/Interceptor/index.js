const Interceptor = require('./interceptor.js')
const http = require('http')

module.exports = class {
  interceptor
  server

  constructor() {
    this.interceptor = new Interceptor()

    this.server = http.createServer(async (req, res) => {
      // 执行拦截器
      await this.interceptor.run({ req, res })

      // 写入响应体
      if (!res.writableFinished) {
        let body = res.body || '200 OK'
        if (body.pipe) {
          body.pipe(res)
        } else {
          if (
            typeof body !== 'string' &&
            res.getHeader('Content-Type') === 'application/json'
          ) {
            body = JSON.stringify(body)
          }
          res.end(body)
        }
      }
    })

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
  }

  listen(opts, cb = () => {}) {
    if (typeof opts === 'number') opts = { port: opts }
    opts.host = opts.host || '0.0.0.0'
    console.log(`Starting up http-server
    http://${opts.host}:${opts.port}`)
    this.server.listen(opts, () => cb(this.server))
  }

  // 注册拦截器
  use(functor) {
    this.interceptor.use(functor)
  }
}
