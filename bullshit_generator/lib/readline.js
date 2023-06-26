import readline from 'readline'

export function question(rl, { text, value }) {
  // 提问的内容
  const q = `${text}(${value})`
  return new Promise((resolve) => {
    // 提问
    rl.question(q, (answer) => {
      return answer || value
    })
  })
}

export async function interact(questions) {
  // 创建 readline 实例
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = []
  for (let i = 0; i < questions.length; i++) {
    const res = await question(rl, questions[i])
    answer.push(res)
  }
  // 关闭 readline 实例
  rl.close()
  return answer
}
