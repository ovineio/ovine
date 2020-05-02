// import { uuid } from 'amis/lib/utils/helper'
import { isArray, isObject, map, random, isFunction, trim } from 'lodash'
import { createElement } from 'react'

import * as Types from '@/utils/types'

/**
 * 日期格式化字符串
 * @param formatter String  模版字符串
 * @param dateString? String 日期字符串
 */
export const formatDate = (formatter: string, date?: string | Date) => {
  const dateObj = !date
    ? new Date()
    : date instanceof Date
    ? date
    : new Date(/^\d*$/.test(date) ? Number(date) : date)

  // eslint-disable-next-line
  if (!(dateObj instanceof Date) || isNaN(dateObj as any)) {
    return formatter
  }

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
    fmt = fmt.replace(RegExp.$1, `${dateObj.getFullYear()}`.substr(4 - RegExp.$1.length))
  }

  // eslint-disable-next-line no-restricted-syntax
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
 * 从数组中随机抽取一个
 * @param source 参数数组
 */
export const choice = (source: any[]): any => {
  return source[random(source.length)]
}

// 校验是否过期
export function isExpired(expiredTime: string | number, baseTime: number = Date.now()): boolean {
  if (!expiredTime) {
    return true
  }

  return baseTime - Number(new Date(expiredTime).valueOf()) > 0
}

/**
 * 解析 querystring 为 json 格式数据
 * @param key 需要获取的数据 json[key], 不传为整个json
 * @param url 待解析的url 默认为location.href
 */
export function getQuery(key: string, url?: string): undefined | string
export function getQuery(key?: string, url?: string): undefined | string | object {
  let str = url || window.location.href

  str = str.indexOf('?') === -1 ? str : str.split('?')[1]

  if (!isSubStr(str, '=')) {
    return undefined
  }

  const items = str.split('&')
  const result: Types.ObjectOf<string> = {}

  items.forEach((v) => {
    const [queryKey, queryVal] = v.split('=')
    result[queryKey] = queryVal
  })

  if (key) {
    return result[key] || undefined
  }

  return result
}

/**
 * 重试异步操作, 主要用于网络异常，导致文件找不到报错 load chunk error
 * @param promiseFn 需要异步操作部分
 * @param retriesLeft 最多尝试的次数, 默认5次
 * @param interval 重试间隔，默认间隔1.5秒
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

/**
 * 是否是子串
 * @param source 模版字符串
 * @param check 待检验字符串
 * @param pos 需要校验的子串位置
 */
export function isSubStr(source: string, check: string, pos?: number): boolean {
  if (typeof source !== 'string') {
    return false
  }
  const index = source.indexOf(check)
  return typeof pos === 'undefined' ? index > -1 : index === pos
}

// classnames 简单版，足够用了
export function cls(...args: any[]): string {
  let str = ''

  args.forEach((arg) => {
    if (typeof arg === 'string') {
      str += ` ${arg}`
    } else if (isArray(arg)) {
      arg.forEach((i: string) => {
        if (typeof i === 'string') {
          str += ` ${i}`
        }
      })
    } else if (isObject(arg)) {
      map(arg, (val, key) => {
        if (val) {
          str += ` ${key}`
        }
      })
    }
  })

  return trim(str)
}

export function timeout(ms: number) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}

// json渲染React组件
export function json2reactFactory(
  mapper: Types.ObjectOf<any> | ((type: string, props?: any) => any)
) {
  return function j2r(
    entrySchema: string | number | { type: string; children?: any; [prop: string]: any } | any[]
  ) {
    const renderElement = (schema: any, key?: any) => {
      if (schema === null) {
        return null
      }

      if (typeof schema === 'string' || typeof schema === 'number') {
        return schema
      }
      const { type: schemaType, children, ...props } = schema
      const hasSchemaType = schemaType && typeof schemaType === 'string' && schemaType.trim() !== ''

      if (!hasSchemaType) {
        throw new Error('schema.type must be a non-empty string')
      }

      const componentChildren: any[] = children && [].concat(children).map(renderElement)
      const componentType = isFunction(mapper) ? mapper(schemaType, props) : mapper[schemaType]

      if (!props.key) {
        props.key = key
      }

      const createArgs: any = [componentType || schemaType, props].concat(componentChildren)

      return createElement.apply(createElement, createArgs)
    }

    if (isArray(entrySchema)) {
      return entrySchema.map(renderElement)
    }
    return renderElement
  }
}
