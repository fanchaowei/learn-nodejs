const Interceptor = require('./interceptor.js')
const http = require('http')
const cluster = require('cluster') // 多进程模块
const cpuNums = require('os').cpus().length // 获取 CPU 核心数
const fs = require('fs')

module.exports = class {
  interceptor
  server
  instances
  enableCluster
  mode

  constructor({ instances = 1, enableCluster = true, mode = 'production' }) {
    this.instances = instances || cpuNums // 指定启动几个进程，默认启动和 cpu 的内核数一样多的进程
    this.enableCluster = enableCluster // 是否启用多进程
    this.mode = mode
    if (this.mode === 'development') {
      this.instances = 1
      this.enableCluster = true
    }

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

    // 处理多线程
    const instances = this.instances
    if (this.enableCluster && cluster.isMaster) {
      // 如果是主进程，则创建子进程
      for (let i = 0; i < instances; i++) {
        cluster.fork()
      }

      // 监听子进程消息事件，如果收到了 count 消息，则打印统计信息
      // let count = 0
      // Object.values(cluster.workers).forEach((worker) => {
      //   worker.on('message', (msg) => {
      //     if (msg === 'count') {
      //       count++
      //       console.log(`visit count ${count}`)
      //     }
      //   })
      // })

      function broadcast(message) {
        // 将信息发送给所有子进程
        Object.values(cluster.workers).forEach((worker) => {
          worker.send(message)
        })
      }

      Object.values(cluster.workers).forEach((worker) => {
        // 监听子进程消息事件，如果收到消息，就把消息发送给其他子进程，让子进程自行处理
        worker.on('message', broadcast)
      })

      if (this.mode === 'development') {
        // 开发模式下，监听文件变化，如果文件变化了，则重启所有子进程，实现热更新
        fs.watch('.', { recursive: true }, (eventType, filename) => {
          if (eventType === 'change') {
            Object.values(cluster.workers).forEach((worker) => {
              console.log(`worker ${worker.process.pid} reload ${filename}`)
              worker.kill()
            })
            cluster.fork()
          }
        })
      } else {
        // 生产监听子进程退出事件，如果退出了则重新启动一个子进程
        cluster.on('exit', (worker, code, signal) => {
          console.log(
            `worker ${worker.process.pid} died, (${
              signal || code
            }) restarting...`
          )
          cluster.fork()
        })
      }
    } else {
      // 如果当前进程是子进程，则启动 http 服务
      this.worker = cluster.worker
      console.log(`Starting up http-server http://${opts.host}:${opts.port}`)
      this.server.listen(opts, () => cb(this.server))
    }
  }

  // 注册拦截器
  use(functor) {
    this.interceptor.use(functor)
  }
}
