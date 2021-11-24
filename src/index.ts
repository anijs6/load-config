import { findUp } from 'find-up'
import { readJson } from 'fs-extra'
/**
 * 异步加载配置数据
 *
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @param context 执行查找文件的上下文
 * @default process.cwd()
 * @returns 配置数据
 */
async function loadConfig(name: string, context: string): Promise<unknown> {
  if (!name) throw new Error('the config file name is invalid')
  const cxt = context || process.cwd()
  const fileNames = ['.json', '.ts', '.js', '.yaml', '.yml'].map(ext => `${name}.config${ext}`)

  const configFile = await findConfigFile(name, ['package.json', ...fileNames], cxt)
  if (!configFile) throw new Error('not located in the config file')

  if (/\.json/.test(configFile)) {
    const jsonData = await readJsonData(configFile, name)
    return jsonData
  }
}

/**
 * 读取json配置文件数据
 *
 * @param file json文件路径
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @returns json数据
 */
async function readJsonData(file: string, name: string): Promise<unknown> {
  const pkgData = await readJson(file)
  return pkgData[name]
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
    async everyPath => {
      const isPackageJson = /package\.json/.test(everyPath)
      if (isPackageJson) {
        const pkgData = await readJson(everyPath)
        if (pkgData[name]) return everyPath
      } else {
        const enterFile = fileNames.find(fileName => new RegExp(`${fileName}$`).test(everyPath))
        if (enterFile) return everyPath
      }
    },
    { cwd: context, type: 'file' }
  )
  return result
}

export default loadConfig
