export function randomInt(min, max) {
  const p = Math.random()
  return Math.floor(min * (1 - p) + max * p)
}

// 段落选取函数的工厂函数
export function createRandomPicker(arr) {
  // 将文章数组保存下来
  const handleArr = [...arr]
  // 随机抽取文章段落的函数
  function randomPick() {
    const len = handleArr.length - 1
    const index = randomInt(0, len)
    // 因为这种文章段落选取的方法，数组的最后一位是永远取不到的
    // 所以每次选取段落之后，都将选取到的段落与最后一位对调
    // 这样就能保证下一次选取不会选取到重复的段落
    ;[handleArr[index], handleArr[len]] = [handleArr[len], handleArr[index]]
    return handleArr[len]
  }
  // 先执行一次，避免数组的最后一位第一次永远都取不到的情况
  randomPick()
  return randomPick
}
