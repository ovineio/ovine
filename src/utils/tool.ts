/**
 * 模版替换字符串 {}
 * @param template String 待替换字符串
 * @param data Object 数据对象
 */
export const templateReplace = (template: string, data: CustomTypes.ObjectOf<any>) => {
  const replaceTplReg = /\{(\w*[:]*[=]*\w+)\}(?!})/g
  return template.replace(replaceTplReg, (...args) => {
    return data[args[1]] || ''
  })
}

/**
 * 日期格式化字符串
 * @param formatter String  模版字符串
 * @param dateString? String 日期字符串
 */
export const dateFormatter = (formatter: string, date?: string | Date) => {
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

/**
 * 现实距离当前时间字符串
 * @param {String} date 时间字符串
 */
export function dateViewText(date: string): string {
  date = date.replace(/-/g, '/')
  const diff = new Date().valueOf() - new Date(date).valueOf()
  const oneMinute = 60 * 1000
  const oneHour = 60 * oneMinute
  const oneDay = 24 * oneHour
  const oneMonth = 31 * oneDay
  const oneYear = 12 * oneMonth

  let unit = ''
  let num = 0

  switch (true) {
    case diff < oneMinute:
      return '1分钟'
    case diff < oneHour:
      unit = '分钟'
      num = diff / oneMinute
      break
    case diff < oneDay:
      unit = '小时'
      num = diff / oneHour
      break
    case diff < oneMonth:
      unit = '天'
      num = diff / oneDay
      break
    case diff < oneYear:
      unit = '月'
      num = diff / oneMonth
      break
    default:
      unit = '年'
      num = diff / oneYear
      break
  }

  return `${Math.floor(num)}${unit}`
}

/**
 * 过滤 传入 对象 值为 undefined | null | {} 的 key
 */
export const filterNullKeys = <T extends object>(source: T): T => {
  const result = source

  // tslint:disable-next-line: forin
  for (const key in source) {
    const value = source[key]
    const type = typeof value

    if (
      type === 'undefined' ||
      value === null ||
      (type === 'object' && !Object.keys(value).length)
    ) {
      delete source[key]
    }
  }

  return result
}

export function getByPath<T>(source: any, path: string, defaultValue?: T): T | undefined {
  if (!source) {
    return defaultValue
  }

  if (!path) {
    return source
  }

  if (!/\./.test(path)) {
    return typeof source[path] !== 'undefined' ? source[path] : defaultValue
  }

  const keys = path.split('.')

  let tempSource = source
  for (const key of keys) {
    tempSource = tempSource[key]
    if (typeof tempSource === 'undefined') {
      return defaultValue
    }
  }

  return typeof tempSource !== 'undefined' ? tempSource : defaultValue
}

export function setByPath<T extends CustomTypes.ObjectOf<any>>(
  source: T,
  path: string,
  value: any
): T {
  if (!source) {
    return source
  }

  if (!/\./.test(path)) {
    source[path] = value
    return source
  }

  const keys = path.split('.')

  let tempSource: T = source
  keys.forEach((key: string, index: number) => {
    if (index === keys.length - 1) {
      tempSource[key] = value
    } else {
      tempSource = isObject(tempSource[key]) ? tempSource[key] : {}
    }
  })

  return tempSource
}

export const getByPaths = (source: any, paths: string[]): any[] => {
  const results: any[] = []

  paths.forEach((path) => {
    results.push(getByPath(source, path))
  })

  return results
}

export function times<T>(length: number, iterator: (i: number) => T): T[] {
  const result: T[] = []
  for (let i = 0; i < length; i++) {
    result.push(iterator(i))
  }
  return result
}

export const uuid = (len: number = 6, radix?: number) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uniqId: any[] = []
  let i: number = 0
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) {
      // tslint:disable-next-line: no-bitwise
      uniqId[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    let r

    uniqId[8] = uniqId[13] = uniqId[18] = uniqId[23] = '-'
    uniqId[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uniqId[i]) {
        // tslint:disable-next-line: no-bitwise
        r = 0 | (Math.random() * 16)
        // tslint:disable-next-line: no-bitwise
        uniqId[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uniqId.join('')
}

export const uniqArray = (source: any[]): any[] => {
  const a = []
  for (let i = 0, l = source.length; i < l; i++) {
    if (a.indexOf(source[i]) === -1) {
      a.push(source[i])
    }
  }
  return a
}

export const removeItem = (source: any[], value: any): any[] => {
  const index = source.indexOf(value)
  if (index > -1) {
    source.splice(index, 1)
  }
  return source
}

export const map = (source: any, iterator: (val: any, key: string) => any): any[] => {
  const result: any[] = []

  if (!source) {
    return result
  }

  for (const key of Object.keys(source)) {
    result.push(iterator(source[key], key))
  }

  return result
}

export const random = (max: number, min: number = 0) => {
  const range = max - min
  const rand = Math.random()
  const num = min + Math.round(rand * range) // 四舍五入
  return num
}

export const choice = (source: any[]): any => {
  return source[random(choice.length - 1)]
}

export const isEqual = (source: any, target: any): boolean | undefined => {
  // 如果a和b本来就全等
  if (source === target) {
    return true
  }
  // 判断是否为null和undefined
  if (source == null || target == null) {
    return source === target
  }
  // 接下来判断a和b的数据类型
  const classNameA = toString.call(source)
  const classNameB = toString.call(target)

  // 如果数据类型不相等，则返回false
  if (classNameA !== classNameB) {
    return false
  } // 如果数据类型相等，再根据不同数据类型分别判断

  switch (classNameA) {
    case '[object RegExp]':
    case '[object String]':
      // 进行字符串转换比较
      return '' + source === '' + target
    case '[object Number]':
      // 进行数字转换比较,判断是否为NaN
      if (+source !== +source) {
        return +target !== +target
      }
      // 判断是否为0或-0
      return +source === 0 ? 1 / +source === 1 / target : +source === +target
    case '[object Date]':
    case '[object Boolean]':
      return +source === +target
  } // 如果是对象类型

  if (classNameA === '[object Object]') {
    // 获取a和b的属性长度
    const propsA = Object.getOwnPropertyNames(source)
    const propsB = Object.getOwnPropertyNames(target)
    if (propsA.length !== propsB.length) {
      return false
    }
    for (const propName of propsA) {
      // 如果对应属性对应值不相等，则返回false
      if (!isEqual(source[propName], target[propName])) {
        return false
      }
    }
    return true
  }

  // 如果是数组类型
  if (classNameA === '[object Array]') {
    if (source.toString() === target.toString()) {
      return true
    }
    return false
  }
}

export function trim(str: string = '') {
  return str.replace(/^\s+|\s+$/gm, '')
}

export function isEmpty(source: any): boolean {
  if (source === undefined || source === null || source === '' || source === '0' || source === 0) {
    return true
  }
  if (isObject(source)) {
    return !Object.keys(source).length
  }

  if (Array.isArray(source)) {
    return !source.length
  }

  return false
}

export function isObject(source: any): boolean {
  return typeof source === 'function' || (typeof source === 'object' && !!source)
}

export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: K[]
): Pick<T, Exclude<keyof T, K>> {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const result = { ...(source as object) } as T
  keys.map((k) => {
    delete result[k]
  })

  return result
}

export function pick<T, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
  const result: any = {}

  keys.map((k) => {
    result[k] = source[k]
  })

  return result
}

/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行，执行最后一次
 * @returns {Function}
 */
export function debounce(method: (args: any) => void, delay: number): (...args: any[]) => void {
  let timer: any = null

  return function(this: any) {
    // tslint:disable-next-line: no-this-assignment
    const self = this
    const args: any = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      method.apply(self, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */
export function throttle(
  method: (args: any) => void,
  mustRunDelay: number
): (...args: any[]) => void {
  let timer: any
  let start: number

  return function loop(this: any) {
    // tslint:disable-next-line: no-this-assignment
    const self = this
    const args: any = arguments
    const now = Date.now()
    if (!start) {
      start = now
    }
    if (timer) {
      clearTimeout(timer)
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args)
      start = now
    } else {
      timer = setTimeout(() => {
        loop.apply(self, args)
      }, 50)
    }
  }
}

// 校验是否过期
export function isExpired(expiredTime: string | number, baseTime: number = Date.now()): boolean {
  if (!expiredTime) {
    return true
  }

  return baseTime - Number(new Date(expiredTime).valueOf()) > 0
}

// 根据对象的 回调寻找 key
export function findKey<T extends object>(
  source: T,
  iterate: (o: any, k: string) => boolean
): string | undefined {
  if (!source) {
    return
  }

  for (const k in source) {
    if (iterate(source[k], k)) {
      return k
    }
  }
}

export function formatNum(num: number | string = ''): string {
  const strAry = num.toString().split('')

  for (let i = strAry.length - 1; i >= 0; i -= 3) {
    if (i !== strAry.length - 1 && i >= 0) {
      strAry.splice(i + 1, 0, ',')
    }
  }

  return strAry.join('')
}

export function numUnitWan(num: number, base: number = 100000, fix: number = 2): string {
  num = Number(num)
  let val: string = formatNum(num)
  if (Math.abs(num) >= 10000000) {
    val = parseFloat(Number(num / 10000000).toFixed(fix)) + '千万'
  } else if (Math.abs(num) >= 1000000) {
    val = parseFloat(Number(num / 1000000).toFixed(fix)) + '百万'
  } else if (Math.abs(num) >= base) {
    val = parseFloat(Number(num / 10000).toFixed(fix)) + '万'
  }
  return val
}

export function queryStringify(source: any) {
  let tmpString = ''

  // tslint:disable-next-line: forin
  for (const key in source) {
    tmpString += `&${key}=${source[key]}`
  }

  return tmpString.substr(1)
}

export function queryStringParse(key: string, url?: string): undefined | string
export function queryStringParse(key?: string, url?: string): undefined | string | object {
  let str = url || location.href

  if (str.indexOf('?') > -1) {
    str = str.split('?')[1]
  }

  const items = str.split('&')
  const result: CustomTypes.ObjectOf<string> = {}

  items.forEach((v) => {
    const arr = v.split('=')
    result[arr[0]] = arr[1]
  })

  if (key) {
    return result[key] || undefined
  }

  return result
}

export function getFullUrl(url: string): string {
  let fullUrl = url
  if (url.indexOf('//') === -1) {
    fullUrl = location.origin + url
  }

  return fullUrl
}

export function getLocationQuery(key: string): string {
  const result = location.search.match(new RegExp('[?&]' + key + '=([^&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}
/**
 * 比较版本
 * @param target 指定版本字符串
 * @param base 基准版本字符串
 * @return boolean 正确匹配 返回true 否则  fasle
 */
export function compareVersion(
  mark: '>' | '=' | '<' | '>=' | '<=' | '!',
  target: string,
  base?: string
): boolean {
  if (!base) {
    return false
  }

  if (mark === '=') {
    return base === target
  }

  if (mark === '!') {
    return base !== target
  }

  const t = Number(target.replace(/\./g, ''))
  const b = Number(base.replace(/\./g, ''))

  switch (mark) {
    case '>':
      return t > b
    case '<':
      return t < b
    case '>=':
      return t >= b
    case '<=':
      return t <= b
  }

  return false
}

export function camelCase(source: string, divide: string = '_'): string {
  let newStr = ''
  const arr = source.split(divide)
  arr.forEach((s, i) => {
    if (!s.length) {
      return
    }

    if (i === 0) {
      newStr += s.substr(0, 1).toLocaleLowerCase()
    } else {
      newStr += s.substr(0, 1).toLocaleUpperCase()
    }
    newStr += s.substr(1, s.length - 1)
  })

  if (newStr.indexOf('-') > -1) {
    newStr = camelCase(newStr, '-')
  }

  if (newStr.indexOf(' ') > -1) {
    newStr = camelCase(newStr, ' ')
  }

  return newStr
}

export function snakeCase(source: string, isKebab: boolean = false): string {
  const result = source.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  if (!result) {
    return source
  }

  return result.map((s: string) => s.toLowerCase()).join(isKebab ? '-' : '_')
}

export function fillArray<T>(source: any[], length: number, value: any = {}): Array<T | any> {
  const len = source.length
  if (len >= length) {
    return source
  }

  for (let i = 0; i < length - len; i++) {
    source.push(value)
  }

  return source
}

export function timeCutDown(count: number, format: 'm:ss' | 'mm:ss' = 'm:ss') {
  const timeFormatAr = format.split(':')

  const minutes = padString('start', Math.round(count / 60), timeFormatAr[0].length, 0)
  const seconds = padString('start', Math.round(count % 60), timeFormatAr[1].length, 0)

  return `${minutes}:${seconds}`
}

export function padString(
  type: 'start' | 'end',
  source: string | number,
  length: number,
  str: string | number
): string {
  const sourceStr = source.toString()
  const len = sourceStr.length
  if (len >= length) {
    return sourceStr
  }

  let padStr = ''
  for (let i = 0; i < length - len; i++) {
    padStr += str
  }

  if (type === 'start') {
    return `${padStr}${sourceStr}`
  }

  return `${sourceStr}${padStr}`
}

export function deepTraversal(node: any[], childKey: string = 'children'): any[] {
  const nodes: any[] = []
  if (node == null) {
    return []
  }
  const stack = [] // 同来存放将来要访问的节点
  stack.push(...node)
  while (stack.length !== 0) {
    const item = stack.pop() // 正在访问的节点
    const children: any = item[childKey]
    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    } else {
      nodes.push(item)
    }
  }
  return nodes
}

export function deepClone<T>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}
