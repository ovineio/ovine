import random from 'lodash/random'

/**
 * 模版替换字符串 {}
 * @param template String 待替换字符串
 * @param data Object 数据对象
 */
export const templateReplace = (template: string, data: Types.ObjectOf<any>) => {
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

export const choice = (source: any[]): any => {
  return source[random(choice.length - 1)]
}

// 校验是否过期
export function isExpired(expiredTime: string | number, baseTime: number = Date.now()): boolean {
  if (!expiredTime) {
    return true
  }

  return baseTime - Number(new Date(expiredTime).valueOf()) > 0
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
  const result: Types.ObjectOf<string> = {}

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
 * 重试异步操作。
 * 主要用于网络异常，导致文件找不到报错 load chunk error
 * @param promiseFn 需要异步操作部分
 * @param retriesLeft 最多尝试的次数
 * @param interval 重试间隔
 */
export function retryPromise<T>(
  promiseFn: () => Promise<T>,
  retriesLeft: number = 5,
  interval: number = 1500
) {
  return new Promise((resolve: (d: T) => any, reject) => {
    promiseFn()
      .then(resolve)
      .catch((error: any) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error)
            return
          }
          retryPromise(promiseFn, retriesLeft - 1, interval).then(resolve, reject)
        }, interval)
      })
  })
}
