const url = require('url')
const path = require('path')

/**
 * 解析 pathname ，获取一个解析后的对象
 * @param {string} rule 路径规则，比如 /test/:course/:lecture
 * @param {string} pathname 路径名，比如 /test/1/2
 * @returns ret: { course: '1', lecture: '2' }
 */
function check(rule, pathname) {
  /**
   * 解析规则
   * paraMatched: [':course', ':lecture']
   * ruleExp: /^\/test\/([^/]+)\/([^/]+)$/
   */
  const paraMatched = rule.match(/:[^\/]+/g)
  const ruleExp = new RegExp(`^${rule.replace(/:[^\/]+/g, '([^/]+)')}$`)

  /**
   * 解析路径名
   * ruleMatched: ['/test/1/2', '1', '2']
   */
  const ruleMatched = pathname.match(ruleExp)

  /**
   * 将规则和路径拼接为对象
   * ret: { course: '1', lecture: '2' }
   */
  if (ruleMatched) {
    let ret = {}
    if (paraMatched) {
      // 存在 paraMatched 才能拼接
      for (let i = 0; i < paraMatched.length; i++) {
        ret[paraMatched[i].slice(1)] = ruleMatched[i + 1]
      }
    }
    return ret
  }
  return null
}

/**
 * 路由拦截器函数
 * @param {string} method GET/POST/PUT/DELETE
 * @param {string} rule 路径规则
 * @param {Function} aspects 拦截函数
 */
function route(method, rule, aspects) {
  return async (ctx, next) => {
    const req = ctx.req
    if (!ctx.url) {
      const URL = url.URL
      // 解析 url
      ctx.url = new URL(`http://${req.headers.host}${req.url}`)
    }
    // 获取
    const checked = check(rule, ctx.url.pathname)
    if (!ctx.route && (method === '*' || req.method === method) && !!checked) {
      // 将解析后的对象挂载到 ctx 上
      ctx.route = checked
      // 执行路由的拦截函数
      await aspects(ctx, next)
    } else {
      // 不满足条件则跳过，去执行下一个拦截函数
      next()
    }
  }
}

class Router {
  baseURL
  constructor(_baseURL = '') {
    this.baseURL = _baseURL
  }

  get(rule, aspects) {
    return route('GET', path.join(this.baseURL, rule), aspects)
  }

  post(rule, aspects) {
    return route('POST', path.join(this.baseURL, rule), aspects)
  }

  put(rule, aspects) {
    return route('PUT', path.join(this.baseURL, rule), aspects)
  }

  delete(rule, aspects) {
    return route('DELETE', path.join(this.baseURL, rule), aspects)
  }

  all(rule, aspects) {
    return route('*', path.join(this.baseURL, rule), aspects)
  }
}

module.exports = Router
