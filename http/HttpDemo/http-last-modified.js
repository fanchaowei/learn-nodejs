const path = require('path')
const url = require('url')
const http = require('http')
const fs = require('fs')
const mime = require('mime')

const server = http.createServer((req, res) => {
  // 获取请求路径
  let filePath = path.resolve(
    __dirname,
    path.join('www', url.fileURLToPath(`file://${req.url}`))
  )
  if (fs.existsSync(filePath)) {
    // 获取文件信息
    const stat = fs.statSync(filePath)
    // 判断是否是文件目录
    const isDir = stat.isDirectory()
    if (isDir) {
      // 是文件目录的话，默认访问该目录下的 index.html 文件
      filePath = path.join(filePath, 'index.html')
    }
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      // 获得文件后缀
      const { ext } = path.parse(filePath)
      const timeStamp = req.headers['if-modified-since']
      let status = 200
      // stats.mtimeMs 是文件最后修改时间的时间戳
      if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
        // 文件最后修改的时间戳和请求头的时间戳相同，说明文件没有修改过
        status = 304
      }
      // 根据文件后缀，设置响应头
      res.writeHead(status, {
        'Content-Type': mime.getType(ext),
        'Cache-Control': 'max-age=86400',
        'Last-Modified': stats.atimeMs,
      })
      if (status === 200) {
        // 获取文件的流
        const fileStream = fs.createReadStream(filePath)
        // 将文件流写入响应头
        fileStream.pipe(res)
      } else {
        // 如果是 304 则直接返回
        res.end()
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h1>Not Found</h1>')
  }
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
