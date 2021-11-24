const esbuild = require('esbuild')
const glob = require('glob')

/**
 *
 */
async function compile() {
  const entryFiles = await getEntryFiles()
  await esbuild.build({
    entryPoints: entryFiles,
    platform: 'node',
    outdir: 'dist'
  })
}

async function getEntryFiles() {
  return new Promise((resolve, reject) => {
    glob('src/**/*.ts', {}, (error, files) => {
      if (error) throw new Error(error)
      console.log(files)
    })
  })
}

compile().catch(console.log)
