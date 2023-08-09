// Description: cookie工具函数，用于处理客户端请求中的cookie
async function getHttpCookie(ctx, next) {
  const { req } = ctx
  const cookieStr = decodeURIComponent(req.headers.cookie || '')
  const cookies = cookieStr.split(/\s*;\s*/)
  ctx.cookies = {}
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=')
    ctx.cookies[key] = value
  })
  await next()
}

module.exports = {
  getHttpCookie,
}
