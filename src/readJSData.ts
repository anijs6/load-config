/**
 * 读取js配置文件数据
 *
 * @param file js文件路径
 * @returns json数据
 */
async function readJSData(file: string): Promise<{ [key: string]: any }> {
  const pkgData = await require(file)
  return pkgData
}

export default readJSData
