// 返回一个大于等于 min 并小于 max 的整数
export function randomInt(min, max) {
  const p = Math.random()
  // Math.floor 的作用是向下取整
  return Math.floor(p * (1 - p) + max * p)
}

console.log(111)

console.log(randomInt(500, 1000))
