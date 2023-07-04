const path = require('path')
const url = require('url')
const http = require('http')
const fs = require('fs')
const mime = require('mime')
const checksum = require('checksum')

const server = http.createServer((req, res) => {
  // 获取请求路径
  let filePath = path.resolve(
    __dirname,
    path.join('www', url.fileURLToPath(`file://${req.url}`))
  )

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h1>Not Found</h1>')
  }

  // checksum.file 用于计算文件的 hash 值
  checksum.file(filePath, (err, sum) => {
    const { ext } = path.parse(filePath)
    // sum 就是文件的 hash 值，用于判断文件是否修改过
    sum = `"${sum}"`
    const ifNoneMatch = req.headers['if-none-match']
    if (ifNoneMatch === sum) {
      // 如果相等则返回 304，用缓存
      res.writeHead(304, {
        'Content-Type': mime.getType(ext),
        etag: sum,
      })
    } else {
      res.writeHead(200, {
        'Content-Type': mime.getType(ext),
        etag: sum,
      })
      const fileStream = fs.ReadStream(filePath)
      fileStream.pipe(res)
    }
  })
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(
  {
    host: '0.0.0.0',
    port: 8080,
  },
  () => {
    console.log('opened server on', server.address())
  }
)
