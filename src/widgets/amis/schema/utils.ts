import { Schema } from 'amis/lib/types'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import map from 'lodash/map'

import request from '~/core/request'
import { LimitSchema, PagePreset } from '~/routes/types'
import logger from '~/utils/logger'

const log = logger.getLogger('dev:amisSchema:utils')

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
  return pathname + search + hash
}

// 请求返回值 格式转化
export const amisResAdapter = (res: any) => {
  return {
    data: {
      status: 0,
      msg: '',
      ...res,
    },
  }
}

// 自定义 amis 请求
export const envFetcher = (option: any) => {
  log.log('amis:fetcher')
  return request(option).then(amisResAdapter)
}

type SchemaPreset = PagePreset & {
  // 所有操作列表
  actions?: Types.ObjectOf<Schema>
  // 所有的表单
  forms?: Types.ObjectOf<Schema>
}

export type RtSchema = Schema &
  LimitSchema & {
    preset?: SchemaPreset // 预设值
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

  map(schema, (value, key) => {
    const logIfNotFound = (val: any) =>
      log
        .if(!val)
        .warn(
          `未找到 $preset: [${key}: ${value}] `,
          `请检查 ${preset.schemaId}/preset 或者 schema.preset`
        )

    if (isObject(value)) {
      schema[key] = convertToAmisSchema(value as any, { preset })
      //
    } else if (key === '$preset') {
      delete schema.$preset
      const presetVal = get(preset, value)
      logIfNotFound(presetVal)
      schema = { ...presetVal, ...schema }
      //
    } else if (typeof value === 'string' && value.indexOf('$preset.') === 0) {
      const presetVal = get(preset, value.replace('$preset.', ''))
      logIfNotFound(presetVal)
      schema[key] = presetVal || null
    }
  })
  return schema
}
