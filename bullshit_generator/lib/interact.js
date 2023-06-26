export function interact(questions) {
  process.stdin.setEncoding('utf8')

  return new Promise((resolve, reject) => {
    const answer = []
    let i = 0
    let { text, value } = questions[i++]
    console.log(`${text}(${value})`)
    process.stdin.on('readable', () => {
      const content = process.stdin.read().slice(0, -1)
      answer.push(content || value)
      const nextQuestion = questions[i++]
      if (nextQuestion) {
        process.stdin.read()
        text = nextQuestion.text
        value = nextQuestion.value
        console.log(`${text}(${value})`)
      } else {
        resolve(answer)
      }
    })
  })
}
