class Interceptor {
  aspects

  constructor() {
    this.aspects = []
  }

  // 注册拦截器
  use(functor) {
    this.aspects.push(functor)
  }

  // 执行拦截器
  async run(context) {
    const aspects = this.aspects

    // 将拦截器嵌套，形成洋葱模型
    const proc = aspects.reduceRight(
      (accumulator, currentValue) => {
        return async () => {
          await currentValue(context, accumulator)
        }
      },
      () => Promise.resolve()
    )

    try {
      await proc()
    } catch (e) {
      console.error(e)
    }

    return context
  }
}

module.exports = Interceptor
