import { readJson } from 'fs-extra'

/**
 * 读取json配置文件数据
 *
 * @param file json文件路径
 * @param name 配置文件名称比如reelup.config.ts就是reelup
 * @returns json数据
 */
async function readJsonData(file: string, name: string): Promise<{ [key: string]: any }> {
  const pkgData = await readJson(file)
  return name ? pkgData[name] : pkgData
}

export default readJsonData
