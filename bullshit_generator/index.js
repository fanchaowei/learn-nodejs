import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 获得当前文件的绝对路径
const url = import.meta.url
// fileURLToPath 将 file:// 协议的 URL 转换成绝对路径(ES Modules 规范)。如果是 CommonJS 规范，可以直接使用 __dirname 获取当前文件的绝对路径
// dirname 获得文件所在的目录
// resolve 将目录和文件名拼接成绝对路径
// 所以下面的  path 就是先根据当前文件的路径，获取到文件的目录的路径，再将目录和文件名拼接成绝对路径
const path = resolve(dirname(fileURLToPath(url)), `corpus/data.json`)
// 读取文件
const data = readFileSync(path, { encoding: 'utf-8' })
const corpus = JSON.parse(data)
