import generator from '../lib/generator.js'
import { createRandomPicker } from '../lib/random.js'

let defaultCorpus = require('../corpus/data.json')
async function loadCorpus(corpusPath) {
  if (corpusPath) {
    defaultCorpus = await (await fetch(corpusPath)).json()
  }
  return defaultCorpus
}

export { generator, createRandomPicker, loadCorpus }
