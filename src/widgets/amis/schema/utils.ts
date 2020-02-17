import { resolveRenderer } from 'amis'
import { RendererConfig } from 'amis/lib/factory'
import { Schema } from 'amis/lib/types'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import map from 'lodash/map'
import { DefaultTheme } from 'styled-components'

import request from '~/core/request'
import { checkLimitByKeys } from '~/routes/limit_util'
import logger from '~/utils/logger'

import { RtSchema, SchemaPreset } from './types'

const log = logger.getLogger('dev:amisSchema:utils')

// 请求返回值 格式转化
export const amisResAdapter = (res: any) => {
  const { code = 0, data: resData, msg, message, ...rest } = res
  const response = {
    status: code,
    msg: msg || message || '',
    data: resData ? resData : rest,
  }

  return {
    data: response,
  }
}

// 自定义 amis 请求
export const envFetcher = (option: any) => {
  // log.log('amis:fetcher', cloneDeep(option))
  return request(option).then(amisResAdapter)
}

// schema 配置，必须 type, limits 同时存在才会校验权限
const checkSchemaLimit = (schema: RtSchema, nodePath?: string) => {
  const { type, limits, limitsLogic = 'and' } = schema || {}

  if (!type || !limits) {
    return true
  }

  if (limitsLogic === 'or' && typeof limits !== 'string') {
    return !!limits.some((limit) => checkLimitByKeys(limit, { nodePath }))
  }

  const isAuth = checkLimitByKeys(limits, { nodePath })

  return isAuth
}

// 过滤无权限操作
export const filterSchemaLimit = (
  schema: RtSchema,
  option: {
    nodePath?: string
  }
) => {
  const { nodePath } = option

  if (!isObject(schema)) {
    return
  }

  if (isArray(schema)) {
    const limitedIdxAr: number[] = []
    schema.forEach((item: RtSchema, index) => {
      if (!checkSchemaLimit(item, nodePath)) {
        limitedIdxAr.push(index)
      } else {
        filterSchemaLimit(item, { nodePath })
      }
    })
    limitedIdxAr.forEach((idx, index) => {
      schema.splice(idx - index, 1)
    })
    return
  }

  if (!checkSchemaLimit(schema, nodePath)) {
    schema.type = 'rt-omit'
    return
  }

  map(schema, (val: RtSchema, key) => {
    if (!isObject(schema)) {
      return
    }

    if (!checkSchemaLimit(val, nodePath)) {
      delete schema[key]
      return
    }

    filterSchemaLimit(val, { nodePath })
  })
}

// 自定义格式 转换为 amis 格式
export const convertToAmisSchema = (
  schema: RtSchema,
  option: {
    preset?: SchemaPreset
  }
): RtSchema => {
  const { preset } = option

  if (!preset) {
    return schema
  }

  const { nodePath } = preset

  map(schema, (value, key) => {
    if (isObject(value)) {
      schema[key] = convertToAmisSchema(value as any, { preset })
      return
    }

    const $presetRefType =
      key === '$preset'
        ? 'key'
        : typeof value === 'string' && value.indexOf('$preset.') === 0
        ? 'value'
        : ''

    if (!$presetRefType) {
      return
    }

    const isKeyRef = $presetRefType === 'key'
    const presetVal = get(preset, isKeyRef ? value : value.replace('$preset.', ''))
    const logStr = ` [${key}: ${value}] 请检查 ${nodePath}/preset 或者 schema.preset`

    if (!presetVal) {
      log.warn('$preset 不存在。', logStr)
      return
    }

    if (presetVal.url) {
      presetVal.api = presetVal.url
    }

    if (!isKeyRef) {
      schema[key] = presetVal
      return
    }

    if (!isObject(presetVal)) {
      log.warn('$preset为key时，只能引用object值。', logStr)
      return
    }
    delete schema['$preset']
    schema = { ...presetVal, ...schema }
  })

  return schema
}

// 顶层有 type 与 css 属性， 自动注入 rt-css
export const wrapCss = (schema: RtSchema) => {
  const { css, tag, htmlClassName, preset, ...restCss } = schema

  if (!css && !tag && !htmlClassName) {
    return schema
  }

  return {
    css,
    tag,
    preset,
    htmlClassName,
    type: 'rt-css',
    body: restCss,
  }
}

// 处理自定义格式
export const resolveRtSchema = (schema: RtSchema) => {
  const { preset = {}, ...rest } = schema
  const reformSchema = { preset, ...rest }

  if (isEmpty(preset)) {
    return reformSchema
  }
  convertToAmisSchema(reformSchema, { preset })
  filterSchemaLimit(rest, preset)

  return reformSchema
}

export const envResolver = (option: {
  path: string
  schema?: Schema
  props?: any
  theme: DefaultTheme
}): null | RendererConfig => {
  const { path, schema, props } = option
  return resolveRenderer(path, schema, props)
}

// amis 官方 格式化项目内 链接
export const normalizeLink = (option: { location?: any; to?: any }) => {
  const { location = window.location, to: toLink } = option

  let to = toLink || ''

  if (to && to[0] === '#') {
    to = location.pathname + location.search + to
  } else if (to && to[0] === '?') {
    to = location.pathname + to
  }

  const searchIdx = to.indexOf('?')
  const hashIdx = to.indexOf('#')
  const isSearch = searchIdx > -1
  const isHash = hashIdx > -1

  let pathname = isSearch ? to.substring(0, searchIdx) : isHash ? to.substring(0, hashIdx) : to
  const search = isSearch ? to.substring(searchIdx, isHash ? hashIdx : undefined) : ''
  const hash = isHash ? to.substring(hashIdx) : location.hash

  if (!pathname) {
    pathname = location.pathname
  } else if (pathname[0] !== '/') {
    const relativeBase = location.pathname
    const paths = relativeBase.split('/')
    paths.pop()
    let m = /^\.\.?\//.exec(pathname)
    while (m) {
      if (m[0] === '../') {
        paths.pop()
      }
      pathname = pathname.substring(m[0].length)
      m = /^\.\.?\//.exec(pathname)
    }
    pathname = paths.concat(pathname).join('/')
  }
  return {
    href: pathname + search + hash,
    pathname,
    search,
    hash,
  }
}
