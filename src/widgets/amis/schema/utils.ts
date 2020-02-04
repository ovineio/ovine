import { Schema } from 'amis/lib/types'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import map from 'lodash/map'

import request, { RequestOption } from '~/core/request'
import logger from '~/utils/logger'

const log = logger.getLogger('dev:amisSchema:utils')

export const amisResAdapter = (res: any) => {
  return {
    data: {
      status: 0,
      msg: '',
      ...res,
    },
  }
}

export const normalizeLink = (option: { location: any; to?: any }) => {
  const { location, to: toLink } = option

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
  return pathname + search + hash
}

export const envFetcher = (option: any) => {
  log.log('amis:fetcher')
  return request(option).then(amisResAdapter)
}

export type Limit = {
  needs?: string[]
  label?: string
  remark?: string
}

type LimitSchema = {
  limits?: string | string[]
}

export type RtSchema = Schema &
  LimitSchema & {
    // 预设值
    preset?: {
      limits?: Types.ObjectOf<Limit>
      // 所有异步请求
      apis?: Types.ObjectOf<RequestOption & LimitSchema>
      // 所有操作列表
      actions?: Types.ObjectOf<Schema>
      // 所有的表单
      forms?: Types.ObjectOf<Schema>
    }
  }
// 转换 schema 计算
export const convertToAmisSchema = (
  schema: RtSchema,
  option: {
    preset?: any
  }
): RtSchema => {
  const { preset } = option

  if (!preset) {
    return schema
  }

  map(schema, (value, key) => {
    if (isObject(value)) {
      schema[key] = convertToAmisSchema(value as any, { preset })
      //
    } else if (key === '$preset') {
      delete schema.$preset
      const presetVal = get(preset, value)
      log.if(!presetVal).warn('未找到 $preset: ', `${key}: ${value}`, ' 请检查preset')
      schema = { ...presetVal, ...schema }
      //
    } else if (typeof value === 'string' && value.indexOf('$preset.') === 0) {
      const presetVal = get(preset, value.replace('$preset.', ''))
      log.if(!presetVal).warn('未找到 $preset: ', `${key}: ${value}`, ' 请检查preset')
      schema[key] = presetVal || null
    }
  })
  return schema
}
