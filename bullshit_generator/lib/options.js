import usage from '../helper/index.js'
import commandLineArgs from 'command-line-args'

// 读取参数
export function parseOptions(options = {}) {
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

export function getOptions() {
  // 配置我们的命令行参数
  const optionDefinitions = [
    { name: 'title', alias: 't', type: String },
    { name: 'min', type: Number },
    { name: 'max', type: Number },
    { name: 'help' },
  ]
  // 获取命令行的输入，利用插件，能判断用户输入的参数是否符合规范
  const options = commandLineArgs(optionDefinitions)
  // 如果是 --help ，则打印帮助文本
  if ('help' in options) {
    console.log(usage)
    // 退出进程
    process.exit()
  }
  return options
}
