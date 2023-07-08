const path = require('path')
const url = require('url')
const http = require('http')
const fs = require('fs')
const mime = require('mime')
const zlib = require('zlib')

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
      const mimeType = mime.getType(ext)
      res.writeHead(status, {
        'Content-Type': mimeType,
        'Cache-Control': 'max-age=86400',
        'Last-Modified': stats.atimeMs,
      })
      const acceptEncoding = req.headers['accept-encoding']
      // 判断客户端是否请求压缩资源，并且判断返回的资源是否是 text 或者 application 类型，如果是图片、视频、音频等我们就不压缩
      const compress = acceptEncoding && /^(text|application)\//.test(mimeType)
      if (compress) {
        const encodingArr = ['gzip', 'deflate', 'br']
        acceptEncoding.split(/\s*,\s*/).some((encording) => {
          // 查看客户端是否支持 gzip、deflate、br 压缩方式，如果支持则设置响应头
          if (encodingArr.includes(encording)) {
            res.setHeader('Content-Encoding', encording)
            return true
          }
          return false
        })
      }
      // 根据文件后缀，设置响应头
      if (status === 200) {
        // 获取文件的流
        const fileStream = fs.createReadStream(filePath)
        // 将文件流写入响应头
        // 判断一下是否需要压缩
        if (compress && compressionEncoding) {
          let comp
          // 使用指定的压缩方式压缩文件
          if (compressionEncoding === 'gzip') {
            comp = zlib.createGzip()
          } else if (compressionEncoding === 'deflate') {
            comp = zlib.createDeflate()
          } else {
            comp = zlib.createBrotliCompress()
          }
          fileStream.pipe(comp).pipe(res)
        } else {
          fileStream.pipe(res)
        }
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
