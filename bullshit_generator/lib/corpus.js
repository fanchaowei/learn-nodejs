import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import moment from 'moment'

// 获得当前文件的绝对路径
const url = import.meta.url
// fileURLToPath 将 file:// 协议的 URL 转换成绝对路径(ES Modules 规范)。
// dirname 获得文件所在的目录，如果是 CommonJS 规范，可以直接使用 __dirname 获取当前文件所在的目录的路径
// 这里自己实现一个 __dirname
const __dirname = dirname(fileURLToPath(url))
// 获取语料库
export function loadCorpus(src) {
  // resolve 将目录和文件名拼接成绝对路径
  // 下面的 path 就是先根据当前文件的路径，获取到文件的目录的路径，再将目录和文件名拼接成绝对路径
  const path = resolve(__dirname, '..', src)
  // 读取文件
  const data = readFileSync(path, { encoding: 'utf-8' })
  const corpus = JSON.parse(data)
  return corpus
}
// 保存文章
export function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, '../output')
  const time = moment().format('|YYYY-MM-DD|HH:mm:ss')
  const outputPath = resolve(outputDir, `${title}${time}.txt`)

  const text = `${title}\n\n    ${article.join('\n    ')}`
  // 如果 output 目录不存在，就创建一个
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir)
  }
  // 写入
  writeFileSync(outputPath, text, { encoding: 'utf-8' })
}
