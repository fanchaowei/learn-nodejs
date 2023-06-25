import generator from './lib/generator.js'
import { createRandomPicker } from './lib/random.js'
import usage from './helper/index.js'
import { loadCorpus, saveCorpus } from './lib/corpus.js'

import commandLineArgs from 'command-line-args'
;(function () {
  main()

  function main() {
    // 配置我们的命令行参数
    const optionDefinitions = [
      { name: 'title', alias: 't', type: String },
      { name: 'min', type: Number },
      { name: 'max', type: Number },
      { name: 'help' },
    ]
    // 获取命令行的输入，利用插件，能判断用户输入的参数是否符合规范
    const options = commandLineArgs(optionDefinitions)
    console.log(options)
    // 如果是 --help ，则打印帮助文本
    if ('help' in options) {
      console.log(usage)
      // 退出进程
      process.exit()
    }

    // // 获取用户输入，非插件
    // const options = parseOptions()
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

  // 读取参数
  function parseOptions(options = {}) {
    const argv = process.argv
    for (let i = 2; i < argv.length; i++) {
      const cmd = argv[i - 1]
      const val = argv[i]
      if (cmd === '--title') {
        options.title = val
      } else if (cmd === '--min') {
        options.min = Number(val)
      } else if (cmd === '--max') {
        options.max = Number(val)
      }
    }
    return options
  }
})()
