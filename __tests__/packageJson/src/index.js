const path = require('path')
const { default: loadConfig } = require('../../../dist/index.js')
/**
 *
 */
async function run() {
  console.log(loadConfig)
  const result = await loadConfig('reelup')
  console.log(result)
}

run()
