const url = require('url')
const querystring = require('querystring')

// 获取 GET 请求的传参
module.exports = async function (ctx, next) {
  const URL = url.URL
  const { query } = new URL(`http://${ctx.req.headers.host}${ctx.req.url}`)
  // querystring 的作用：
  // key1=value1&key2=value2&key3=value3 --> { key1: 'value1', key2: 'value2', key3: 'value3' }
  ctx.params = querystring.parse(query)
  await next()
}
