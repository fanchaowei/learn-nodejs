const http = require('http')
const url = require('url')

// createServer 创建一个 HTTP 服务器实例
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url)
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    // res.end 的作用是结束响应，告诉客户端所有发送的响应头和主体都已经发送完成
    res.end('<h1>Hello world</h1>')
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Not Found</h1>')
  }
})

// clitenError 事件是当客户端连接错误时触发
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
