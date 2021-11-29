const runAll = require('npm-run-all')

runAll(['build', 'type'], { parrallel: true }).then(() => console.log('compile done!'))

runAll(['semantic'], { parrallel: false }).then(() => console.log('release done!'))
