import { createRandomPicker, randomInt } from './random.js'

export default function generator(
  title,
  { corpus, min = 600, max = 1000 } = {}
) {
  // 提取出文章中的名人名言、前置废话、废话、后置废话、结尾废话
  const { famous, bosh_before, bosh, said, conclude } = corpus
  // 将这些段落传入到段落选取函数的工厂函数中，生成段落选取函数
  const [pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude] = [
    famous,
    bosh_before,
    bosh,
    said,
    conclude,
  ].map((item) => {
    return createRandomPicker(item)
  })

  // 随机生成文章的长度
  const artLen = randomInt(min, max)
  // 文章的总长度
  let totalLength = 0
  // 以段落为元素单位，存储的文章
  const article = []

  while (totalLength < artLen) {
    // 生成一个随机数，决定当前段落的长度
    const sectionLen = randomInt(100, 300)
    let section = ''
    // 如果当前段落字数小于段落长度，或者当前段落不是以句号。和问号？结尾的，就继续循环
    while (section.length < sectionLen || !/[。？]$/.test(section)) {
      // 再定一个随机数
      const n = randomInt(0, 100)
      if (n < 20) {
        // n 小于 20，生成名人名言
        section += sentence(pickFamous, {
          said: pickSaid,
          conclude: pickConclude,
        })
      } else if (n < 50) {
        // 如果 n 小于 50，生成一个带有前置从句的废话
        section +=
          sentence(pickBoshBefore, { title }) + sentence(pickBosh, { title })
      } else {
        // 否则生成一个不带有前置从句的废话
        section += sentence(pickBosh, { title })
      }
    }
    // 更新文章总长度
    totalLength += section.length
    // 将段落推入文章数组
    article.push(section)
  }

  return article
}

// 生成一段段落
// pick 是段落选取函数
// replacer 是一个对象，里面的 key 是段落中需要替换的变量，value 是对应的段落选取函数
function sentence(pick, replacer) {
  let ret = pick()
  // 循环替换段落中的变量
  for (const key in replacer) {
    ret = ret.replace(
      new RegExp(`{{${key}}}`, 'g'),
      typeof replacer[key] === 'function' ? replacer[key]() : replacer[key]
    )
  }
  return ret
}
