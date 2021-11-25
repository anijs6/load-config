export interface ReadDataParams {
  /** 执行查找的上下文 */
  cwd: string
  /** 配置项目名称 */
  configName: string
  /** 配置文件路径 */
  configFile: string
  /** 上一步配置数据 */
  beforeConfigData: { [key: string]: any }
}

export interface ReadData {
  (params: ReadDataParams): Promise<{ [key: string]: any }>
}
