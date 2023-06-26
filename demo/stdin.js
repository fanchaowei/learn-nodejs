console.log('请输入数字')

process.stdin.setEncoding('utf8')

let sum = 0
// 用户输入时，readable 就会触发
process.stdin.on('readable', () => {
  // 获取输入的数据
  const chunk = process.stdin.read()
  // slice(0, -1)，去除最后一位回车符，-1 代表最后一位
  const num = Number(chunk.slice(0, -1))
  sum += num
  if (num === 0) {
    // 执行下面的 end
    process.stdin.emit('end')
    return
  }
  // 再调用一次这个，可以保持监听状态
  process.stdin.read()
})

process.stdin.on('end', () => {
  console.log(`求和结果是：${sum}`)
})
