import findUp from 'find-up'
import { readJsonSync, pathExists } from 'fs-extra'
import path from 'path'
import debug from 'debug'
import type { ReadData } from './interface'
import handleJSON from './handleJSON'
import handleTS from './handleTS'

if (process.env.DEBUG_LOAD_FILE) {
  debug.enable('load-config:*')
}

const readData: ReadData = async params => {
  const { configFile } = params || {}
  const fileExt = path.extname(configFile)

  console.log(fileExt)
  let result = {}
  if (fileExt === '') {
    // path url
  }
  console.log(fileExt)
  if (fileExt === '.json') result = await handleJSON(params, readData)
  if (fileExt === '.ts') result = await handleTS(params, readData)
  return result
}

/**
 * 异步加载配置数据
 *
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @param cwd 执行查找文件的上下文
 * @default process.cwd()
 * @returns 配置数据
 */
async function loadConfig(name: string, cwd: string): Promise<{ [key: string]: any }> {
  console.log('111111')
  if (!name) throw new Error('the config file name is invalid')
  const cxt = cwd || process.cwd()
  const fileNames = ['.json', '.ts', '.js', '.yaml', '.yml'].map(ext => `${name}.config${ext}`)

  const configFile = await findConfigFile(name, ['package.json', ...fileNames], cxt)
  if (!configFile) throw new Error('not located in the config file')
  const configData = await readData({
    cwd: cxt,
    configName: name,
    configFile,
    beforeConfigData: {}
  })
  return configData
}

/**
 * 寻找项目根节点
 *
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @param fileNames 按照优先级排列的文件名称列表
 * @param context 执行查找文件的上下文
 * @returns 返回第一个package.json文件路径
 */
export async function findConfigFile(
  name: string,
  fileNames: Array<string>,
  context: string
): Promise<string | undefined> {
  const result = await findUp(
    async (directory: string) => {
      const pathExitPromiseList = fileNames.map(fileName => pathExists(path.join(directory, fileName)))
      const pathExitResultList = await Promise.all(pathExitPromiseList)

      const validIndex = pathExitResultList.findIndex((pathExit, index) => {
        if (pathExit) {
          const file = path.join(directory, fileNames[index])
          const isPackageJson = /package\.json/.test(file)

          if (isPackageJson) {
            const pkgData = readJsonSync(file)
            if (pkgData[name]) return true
          } else return true
        }
        return false
      })

      if (validIndex > -1) return path.join(directory, fileNames[validIndex])
    },
    { cwd: context, type: 'file' }
  )
  return result
}

export default loadConfig
