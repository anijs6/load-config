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

/**
 * 获取src目录下所有的文件
 */
async function getEntryFiles() {
  return new Promise((resolve, reject) => {
    glob('src/**/*.ts', {}, (error, files) => {
      if (error) reject(error)
      else resolve(files)
    })
  })
}

compile().catch(console.log)
