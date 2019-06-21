/**
 * logger日志打印模块
 */

const templateReplace = (template: string, data: CustomTypes.ObjectOf<any>) => {
  const replaceTplReg = /\{(\w*[:]*[=]*\w+)\}(?!})/g
  return template.replace(replaceTplReg, (...args) => {
    return data[args[1]] || ''
  })
}

const dateFormatter = (formatter: string, date?: string | Date) => {
  const dateObj = !date ? new Date() : date instanceof Date ? date : new Date(date)

  const transObj: any = {
    'M+': dateObj.getMonth() + 1, // 月份
    'd+': dateObj.getDate(), // 日
    'h+': dateObj.getHours(), // 小时
    'm+': dateObj.getMinutes(), // 分
    's+': dateObj.getSeconds(), // 秒
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
    S: dateObj.getMilliseconds(), // 毫秒
  }

  let fmt = formatter

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (const k in transObj) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? transObj[k] : `00${transObj[k]}`.substr(`${transObj[k]}`.length)
      )
    }
  }

  return fmt
}

/* tslint:disable: no-console */

const logFormat = {
  moduleName: 'text-decoration: underline;',
  log: 'background-color: #eceff1; color: #263238;',
  info: 'background-color: #E3F2FD; color: #2196F3;',
  error: 'background-color: #EF5350; color: #fff !important;',
  warn: 'background-color: #fff8e1; color: #ff9800;',
}

const logTemplate = {
  common: '%c [{timeStr} {OnlyStr} {level} %c{moduleName}%c ]',
}

export const levels: CustomTypes.Map<'log' | 'info' | 'warn' | 'error', Debug.Level> = {
  log: 'log' as any,
  info: 'info' as any,
  warn: 'warn' as any,
  error: 'error' as any,
}

// 默认所有日志均显示
let debugConfig: Debug.Config = {
  level: levels.info,
  moduleName: '.*',
  onlyLevel: false,
  enable: true,
  defaultDebugOption: {
    timeFormatter: 'hh:mm:ss',
    moduleName: 'app',
    showTime: true,
    onlySelf: false,
    level: levels.log,
  },
}

const isSimpleDebug: boolean = false
let onlySelfFlag: boolean | CustomTypes.NullValue = null
/**
 * 过滤日志打印信息
 */
const filterLog = (option: Required<Pick<Debug.Option, 'level' | 'moduleName'>>): boolean => {
  const { level, moduleName, onlyLevel } = debugConfig

  // 打包环境不打印LOG
  if (isRelease()) {
    return false
  }

  const allowedLevel: Debug.Level[] = []

  if (onlyLevel) {
    // 仅仅打印当前级别的LOG
    allowedLevel.push(level)
  } else {
    // ERROR > WARN > INFO > LOG
    switch (level) {
      case levels.log:
        allowedLevel.push(levels.log)
      case levels.info:
        allowedLevel.push(levels.info)
      case levels.warn:
        allowedLevel.push(levels.warn)
      case levels.error:
        allowedLevel.push(levels.error)
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

const isRelease = () => {
  if (!debugConfig.enable) {
    return true
  }
}

export const logger: Debug.IDebug = {
  getLogger(moduleName: string, option: Debug.Option = {}) {
    const debugOption: Debug.Option = { ...option, moduleName }

    return {
      log: (...logDetail: any[]) => this.signedLogger(levels.log, debugOption, logDetail),
      info: (...logDetail: any[]) => this.signedLogger(levels.info, debugOption, logDetail),
      warn: (...logDetail: any[]) => this.signedLogger(levels.warn, debugOption, logDetail),
      error: (...logDetail: any[]) => this.signedLogger(levels.error, debugOption, logDetail),
    }
  },
  setConfig(conf: Partial<Debug.Config>): void {
    debugConfig = {
      ...debugConfig,
      ...conf,
    }

    // 打包环境不打印日志
    if (isRelease()) {
      return
    }

    console.warn('==DEBUG SET::', debugConfig)
  },
  debugLogger(option: Debug.Option, loggerDetail: any[]) {
    // 打包环境不打印日志
    if (isRelease()) {
      return
    }

    const debugOption = { ...debugConfig.defaultDebugOption, ...option }
    const { timeFormatter, moduleName, showTime, level, onlySelf } = debugOption

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

    if (isSimpleDebug) {
      console.log.call(null, `[ ${level} ${moduleName} ]`, ...loggerDetail)
      return
    }

    const timeStr = showTime ? dateFormatter(timeFormatter) : ''

    const template: string = templateReplace(logTemplate.common, {
      timeStr,
      moduleName,
      level: level.toLocaleUpperCase(),
    })

    const logArgs: any[] = [
      template,
      `${logFormat[level]}`,
      `${logFormat[level]}${logFormat.moduleName}`,
      `${logFormat[level]}`,
    ]
    const log = Function.prototype.bind.call(console.log, console)
    log.apply(console, logArgs.concat(loggerDetail))
    // console.log('logArgs->', logArgs);
    // console.log.call(null, ...logArgs.concat(...loggerDetail)) // 该方法不兼容IE9-IE11
  },
  log(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: levels.log, moduleName }, loggerDetail)
  },
  info(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: levels.info, moduleName }, loggerDetail)
  },
  warn(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: levels.warn, moduleName }, loggerDetail)
  },
  error(moduleName: string, ...loggerDetail: any[]) {
    this.debugLogger({ level: levels.info, moduleName }, loggerDetail)
  },
  signedLogger(level: Debug.Level, option: Debug.Option, loggerDetail: any[]) {
    this.debugLogger.call(null, { ...option, level }, loggerDetail)
  },
}
// 全局化日志打印无须 import
export default logger

// TODO: 添加 timestamp 打印耗时统计 功能
