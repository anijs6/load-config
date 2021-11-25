import { writeFile } from 'fs-extra'
import path from 'path'
import { build as esbuild } from 'esbuild'
import tmp from 'tmp'

/**
 * 获取ts配置数据
 *
 * @param file 配置文件路径
 * @returns 配置数据
 */
async function readTSData(file: string): Promise<{ [key: string]: any }> {
  const fileName = path.basename(file, '.ts')
  const outfile = `${fileName}.js`
  const buildResult = await esbuild({
    absWorkingDir: process.cwd(),
    entryPoints: [file],
    write: false,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    plugins: [
      {
        name: 'external-dependencies',
        setup(build) {
          build.onResolve({ filter: /.*/ }, args => {
            const id = args.path
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return {
                external: true
              }
            }
          })
        }
      }
    ]
  })

  const { text } = buildResult.outputFiles[0]

  const result = await new Promise((resolve, reject) => {
    tmp.dir(async (err, tmpPath, cleanupCallback) => {
      if (err) reject(err)
      const tmpOutfile = path.join(tmpPath, outfile)
      await writeFile(tmpOutfile, text)
      resolve(require(tmpOutfile).default)
      cleanupCallback()
    })
  })
  return result as any
}

export default readTSData
