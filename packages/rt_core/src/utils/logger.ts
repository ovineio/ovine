/**
 * logger模块
 * 错误，异常等地方都应输入日志，给出提示
 */

type Level = 'log' | 'info' | 'warn' | 'error'

type Option = {
  isPrint?: boolean
  moduleName?: string
  level?: Level
  onlySelf?: boolean
}

type Config = {
  level: Level // LOG级别
  enable: boolean // 只在打包环境下有效
  moduleName: string
  onlyLevel: boolean
  defaultDebugOption: Required<Option>
}

// 默认所有日志均显示
let debugConfig: Config = {
  level: 'log',
  moduleName: '',
  onlyLevel: false,
  enable: true,
  defaultDebugOption: {
    isPrint: true,
    moduleName: 'app*',
    onlySelf: false,
    level: 'log',
  },
}

let onlySelfFlag: boolean | Types.NullValue = null

// 过滤日志打印信息
const filterLog = (option: Required<Pick<Option, 'level' | 'moduleName'>>): boolean => {
  const { level, moduleName, onlyLevel } = debugConfig

  // 打包环境不打印LOG
  if (isRelease()) {
    return false
  }

  const allowedLevel: Level[] = []

  if (onlyLevel) {
    // 仅仅打印当前级别的LOG
    allowedLevel.push(level)
  } else {
    // ERROR > WARN > INFO > LOG
    switch (level) {
      case 'log':
        allowedLevel.push('log')
      case 'info':
        allowedLevel.push('info')
      case 'warn':
        allowedLevel.push('warn')
      case 'error':
        allowedLevel.push('error')
    }
  }

  // 过滤不同级别的 LOG
  if (!allowedLevel.find((l) => l === option.level)) {
    return false
  }

  // 根据传入的 moduleName 过滤 日志
  if (!moduleName || !new RegExp(moduleName).test(option.moduleName)) {
    return false
  }

  return true
}

// 判断 生产环境
const isRelease = () => {
  if (process.env.ENV === 'production' && !debugConfig.enable) {
    return true
  }
}

// 设置 日志 配置
export const setConfig = (conf: Partial<Config>): void => {
  debugConfig = {
    ...debugConfig,
    ...conf,
  }

  // 打包环境不打印日志
  if (isRelease()) {
    return
  }

  logger.info('app:logger:config', debugConfig)
}

export class Logger {
  public log(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: 'log', moduleName }, loggerDetail)
  }

  public info(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: 'info', moduleName }, loggerDetail)
  }

  public warn(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: 'warn', moduleName }, loggerDetail)
  }

  public error(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: 'error', moduleName }, loggerDetail)
  }

  public getLogger(moduleName: string, option: Option = {}) {
    const debugOption: Option = { ...option, moduleName }

    return {
      time: <T>(label: string, timeFn: () => T): T => this.time(label, timeFn, debugOption),
      if: (isPrint: boolean) => this.getLogger(moduleName, { ...option, isPrint }),
      log: (...logDetail: any[]) => this.signedLogger('log', debugOption, logDetail),
      info: (...logDetail: any[]) => this.signedLogger('info', debugOption, logDetail),
      warn: (...logDetail: any[]) => this.signedLogger('warn', debugOption, logDetail),
      error: (...logDetail: any[]) => this.signedLogger('error', debugOption, logDetail),
    }
  }

  private time<T>(label: string, timeFn: () => T, debugOption: Option): T {
    const start = Date.now()
    const result = timeFn()
    const end = Date.now()
    this.debugLogger.call(null, debugOption, [`${label || 'time'}: ${end - start}ms`, result])
    return result
  }

  private debugLogger(option: Option, loggerDetail: any[]) {
    // 打包环境不打印日志
    if (isRelease()) {
      return
    }

    const debugOption = { ...debugConfig.defaultDebugOption, ...option }
    const { moduleName, level, onlySelf } = debugOption

    onlySelfFlag = null

    // onlySelf 为 bool值时 设置 onlySelfFlag
    if (typeof onlySelf === 'boolean') {
      onlySelfFlag = onlySelf
    }

    // onlySelfFlag === true && onlySelf === true  时直接打印
    // 否则 需要校验 moduleName 与 level 级别
    if ((!onlySelfFlag || !onlySelf) && !filterLog({ level, moduleName })) {
      return
    }

    const now = new Date()
    const logArgs: any[] = [
      `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${level.toUpperCase()} ${moduleName}]__::`,
    ]

    const log = Function.prototype.bind.call(console[level] || console['log'], console)
    log.apply(console, logArgs.concat(loggerDetail))
    // console.log('logArgs->', logArgs);
    // console.log.call(null, ...logArgs.concat(...loggerDetail)) // 该方法不兼容IE9-IE11
  }

  private signedLogger(level: Level, option: Option, loggerDetail: any[]) {
    const { isPrint = true } = option
    if (!isPrint) {
      return
    }
    this.debugLogger.call(null, { ...option, level }, loggerDetail)
  }
}

const logger = new Logger()

export default logger
