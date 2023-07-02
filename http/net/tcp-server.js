const net = require('net')
// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// createServer 的参数是一个回调函数，会在有客户端连接到服务器时执行
const server = net
  .createServer((socket) => {
    socket.on('data', (data) => {
      console.log(`DATA:\n\n${data}`)
    })
    socket.on('close', () => {
      console.log('connection closed, goodbye!\n\n\n')
    })
  })
  .on('error', (err) => {
    console.error(err)
  })

// listen 的作用是启动服务器，并且开始监听指定端口
// listen 第一个参数是配置项，第二个参数是一个回调函数，会在服务器启动成功后执行
server.listen(
  {
    host: '0.0.0.0',
    port: 8080,
  },
  () => {
    console.log('opened server on', server.address())
  }
)
