// 声明全局模块
declare namespace Debug {
  interface IDebug {
    /**
     * 设置模块配置
     */
    setConfig(conf: Partial<Config>): void
    /**
     * 日志打印模块
     */
    debugLogger(option: Debug.Option, ...logDetail: any[]): void
    /**
     * getLogger 简介化打印配置, 得到一个配置化的 logger
     * @param moduleName String
     * @param level String
     * @param option String
     */
    getLogger(moduleName: string, option?: Option): LevelLoggers
    // 配置过的logger
    signedLogger(level: Level, option: Option, loggerDetail: any[]): void
    // 封装简洁的调用方式
    log(moduleName: string, ...logDetail: any[]): void
    info(moduleName: string, ...logDetail: any[]): void
    warn(moduleName: string, ...logDetail: any[]): void
    error(moduleName: string, ...logDetail: any[]): void
  }

  /**
   * 此处使用了 const 关键字，可以将 枚举变量映射为JS一个正是可引用的对象，而不是仅仅是类型校验。
   */
  enum Level {
    LOG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
  }

  type Option = {
    moduleName?: string
    level?: Level
    showTime?: boolean
    onlySelf?: boolean
    timeFormatter?: string
  }

  type Config = {
    level: Level // LOG级别
    enable: boolean // 只在打包环境下有效
    moduleName: string
    onlyLevel: boolean
    defaultDebugOption: Required<Option>
  }

  type LevelLoggers = {
    log: (...logArgs: any[]) => void
    info: (...logArgs: any[]) => void
    warn: (...logArgs: any[]) => void
    error: (...logArgs: any[]) => void
  }
}
