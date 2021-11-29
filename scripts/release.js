const runAll = require('npm-run-all')

runAll(['build', 'type'], { parrallel: true })
  .then(() => console.log('compile done!'))
  .catch(error => console.log(error))

runAll(['changelog'], { parrallel: false })
  .then(() => console.log('release done!'))
  .catch(error => console.log(error))
