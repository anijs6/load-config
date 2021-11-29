import yaml from 'yaml'
import fs from 'fs/promises'

/**
 * 读取yaml配置文件数据
 *
 * @param file yaml文件路径
 * @returns json数据
 */
async function readYAMLData(file: string): Promise<{ [key: string]: any }> {
  const yamlStr = await fs.readFile(file, 'utf-8')
  const pkgData = await yaml.parse(yamlStr)
  return pkgData
}

export default readYAMLData
