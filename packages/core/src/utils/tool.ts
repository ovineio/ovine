import { isArray, isObject, map, random, isFunction, trim } from 'lodash'
import { parse } from 'qs'
import { createElement } from 'react'

import * as Types from '@/utils/types'

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
  const time = /^\d*$/.test(`${expiredTime}`)
    ? Number(expiredTime)
    : new Date(expiredTime).valueOf()
  return baseTime - time > 0
}

/**
 * 解析 querystring 为 json 格式数据
 * @param key 需要获取的数据 json[key], 不传为整个json
 * @param url 待解析的url 默认为location.href
 */
export function getUrlParams(key?: string, url?: string): any | undefined {
  const str = url || window.location.href

  const idx = str.indexOf('?')
  const hashIdx = str.indexOf('#')

  if (idx === -1) {
    return undefined
  }

  const urlParams = parse(str.substring(idx + 1, hashIdx !== -1 ? hashIdx : undefined)) || {}

  if (key) {
    return urlParams[key] || undefined
  }

  return urlParams
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

// timeout promise 化
export function promisedTimeout(ms: number) {
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

// 异步加载脚本
export function loadScriptAsync(src: string, async: boolean = true) {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script')
    if (async) {
      script.async = true
    }
    if (!src.startsWith('http')) {
      // 相对根目录地址
      script.src = window.origin + src.substr(1)
    } else {
      script.src = src
    }
    script.onload = () => {
      resolve()
    }
    script.onerror = (e) => {
      reject(e)
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
