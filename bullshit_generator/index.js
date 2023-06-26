import generator from './lib/generator.js'
import { createRandomPicker } from './lib/random.js'
import { loadCorpus, saveCorpus } from './lib/corpus.js'
import { parseOptions, getOptions } from './lib/options.js'
import { interact } from './lib/interact.js'
;(function () {
  main()

  async function main() {
    // 获取 options
    const options = getOptions()
    // // 获取用户输入，非插件
    // const options = parseOptions()

    // 监听用户输入
    if (Object.keys(options).length <= 0) {
      const answers = await interact([
        { text: '请输入文章主题', value: '科学和人文谁更有意义' },
        { text: '请输入最小字数', value: 6000 },
        { text: '请输入最大字数', value: 10000 },
      ])
      options.title = answers[0]
      options.min = answers[1]
      options.max = answers[2]
    }

    // 获取语料库
    const corpus = loadCorpus(`corpus/data.json`)
    // 获得生成文章标题函数
    const pickTitle = createRandomPicker(corpus.title)
    // 生成文章标题
    const title = options.title || pickTitle()
    // 生成文章
    const article = generator(title, { corpus, ...options })
    // 保存文章
    saveCorpus(title, article)
  }
})()
