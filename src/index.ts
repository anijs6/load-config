import findUp from 'find-up'
import { readJson, readJsonSync, pathExists } from 'fs-extra'
import path from 'path'
import merge from 'deepmerge'
import debug from 'debug'

const logger = debug('@anijs:load-config')

/**
 * 异步加载配置数据
 *
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @param context 执行查找文件的上下文
 * @default process.cwd()
 * @returns 配置数据
 */
async function loadConfig(name: string, context: string): Promise<{ [key: string]: any }> {
  if (!name) throw new Error('the config file name is invalid')
  const cxt = context || process.cwd()
  logger('首次执行查找的上下文', cxt)
  const fileNames = ['.json', '.ts', '.js', '.yaml', '.yml'].map(ext => `${name}.config${ext}`)

  const configFile = await findConfigFile(name, ['package.json', ...fileNames], cxt)
  logger('读取配置数据的文件来源', configFile)
  if (!configFile) throw new Error('not located in the config file')
  const configData = await readData(cxt, configFile, {}, name)
  logger('最终处理完之后的数据', configData)
  return configData
}

/**
 * 根据文件名称或者路径读取数据
 *
 * @param cwd 执行查找的上下文
 * @param file 配置文件
 * @param initData 上一次运行的结果
 * @param jsonKey 读取json数据的某一个字段
 * @returns 返回对象数据
 */
async function readData(
  cwd: string,
  file: string,
  initData: { [key: string]: any },
  jsonKey?: string
): Promise<{ [key: string]: any }> {
  const fileExt = path.extname(file)
  // node_modules
  if (fileExt === '') {
    return {}
    // path url
  }
  const absolutePath = path.isAbsolute(file)
  logger('配置文件上下文', cwd)
  const filePath = absolutePath ? file : path.resolve(cwd, '../', file)
  logger('读取数据的路径', filePath)
  if (fileExt === '.json') {
    logger('读取数据的方式', 'json')
    const jsonData = ((await readJsonData(
      filePath,
      path.basename(filePath) === 'package.json' ? jsonKey : ''
    )) || {}) as { [key: string]: any }
    logger('当前文件配置数据', jsonData)

    const extendsFile = jsonData.extends

    const newResult = merge(jsonData, initData)
    logger('合并之前的数据结果', newResult)
    if (extendsFile !== undefined) {
      logger('从继承文件中读取数据', extendsFile)
      const result = await readData(filePath, extendsFile, newResult)
      return result
    }
    return jsonData
  }
  return {}
}

/**
 * 读取json配置文件数据
 *
 * @param file json文件路径
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @returns json数据
 */
async function readJsonData(file: string, name?: string): Promise<unknown> {
  const pkgData = await readJson(file)
  return name ? pkgData[name] : pkgData
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
