import { readJson, readFile } from 'fs-extra'
import path from 'path'
import merge from 'deepmerge'
import { transform as esbuildTransform } from 'esbuild'
import type { ReadData, ReadDataParams } from './interface'

/**
 * 处理.ts文件数据
 *
 * @param params 接收参数
 * @param callback 回调函数
 * @returns 配置数据
 */
async function handleTS(params: HandleJsonParams, callback: ReadData): Promise<{ [key: string]: any }> {
  const { configFile, cwd = process.cwd(), configName = '', beforeConfigData } = params || {}

  const absolutePath = path.isAbsolute(configFile)
  const filePath = absolutePath ? configFile : path.resolve(cwd, '../', configFile)

  const jsonData = ((await readTsData(filePath)) || {}) as { [key: string]: any }

  const extendsFile = jsonData.extends

  const newResult = merge(jsonData, beforeConfigData)
  if (extendsFile !== undefined) {
    const result = await callback({
      cwd: filePath,
      configFile: extendsFile,
      beforeConfigData: newResult,
      configName
    })
    return result
  }
  if (newResult.extends !== undefined) delete newResult.extends
  return newResult
}

/**
 * @param file
 */
async function readTsData(file: string): Promise<unknown> {
  const sourceCode = await readFile(file, { encoding: 'utf-8' })
  console.log(sourceCode)
  const result = await esbuildTransform(sourceCode, {
    loader: 'ts'
  })
  return result
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
  return name ? pkgData[name] : pkgData
}

interface HandleJsonParams extends ReadDataParams {
  type?: 'ts'
}

export default handleTS
