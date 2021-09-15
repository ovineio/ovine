import { resolveRenderer } from 'amis'
import { RendererConfig } from 'amis/lib/factory'
import { Schema } from 'amis/lib/types'
import { filter } from 'amis/lib/utils/tpl'
import { get, isArray, isEmpty, isObject, map, omit, isFunction } from 'lodash'

import { checkLimitByKeys } from '@/routes/limit/exports'
import logger from '@/utils/logger'
import { ObjectOf } from '@/utils/types'

import { LibSchema, SchemaPreset } from './types'

const log = logger.getLogger('dev:amisSchema:utils')

// 校验 schema 权限
const checkSchemaLimit = (schema: LibSchema, nodePath?: string) => {
  const { limits, limitsLogic = 'and' } = schema || {}

  if (!limits) {
    return true
  }

  if (limitsLogic === 'or' && typeof limits !== 'string') {
    return !!limits.some((limit: any) => checkLimitByKeys(limit, { nodePath }))
  }

  const isAuth = checkLimitByKeys(limits, { nodePath })

  return isAuth
}

// 过滤无权限操作
export const filterSchemaLimit = (
  schema: LibSchema,
  option?: {
    nodePath?: string
    isDefinitions?: boolean
  }
) => {
  const { nodePath, isDefinitions } = option || {}
  if (!isObject(schema)) {
    return
  }

  if (isArray(schema)) {
    const limitedIdxAr: number[] = []
    schema.forEach((item: LibSchema, index) => {
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
    ;(schema as any).type = 'lib-omit'
    return
  }

  map(schema, (val: LibSchema, key) => {
    if (!isObject(schema)) {
      return
    }

    if (!checkSchemaLimit(val, nodePath)) {
      if (isDefinitions) {
        schema[key] = {
          type: 'lib-omit',
        }
      } else {
        delete (schema as any)[key]
      }
      return
    }

    filterSchemaLimit(val, { nodePath, isDefinitions: key === 'definitions' })
  })
}

// 自定义格式 转换为 amis 格式
export const convertToAmisSchema = (
  schema: LibSchema,
  option: {
    preset?: SchemaPreset
    definitions?: any
    constants?: ObjectOf<string>
  }
): LibSchema => {
  const { definitions, preset, constants } = option

  if (!preset && !definitions && !constants) {
    return schema
  }

  const { nodePath } = preset || {}

  map(schema, (value, key) => {
    // trans constants key
    if (constants) {
      if (typeof value === 'string' && /\$\{[A-Z][A-Z0-9_]*\}/.test(value)) {
        const newVal = filter(value, constants)
        schema[key] = newVal
      }
      if (typeof key === 'string' && /\$\{[A-Z][A-Z0-9_]*\}/.test(key)) {
        const newKey = filter(key, constants)
        schema[newKey] = value
        delete schema[key]
      }
    }

    // Omit " apis" and "limits"
    if (key === 'apis' || key === 'limits') {
      return
    }

    if (isObject(value)) {
      schema[key] = convertToAmisSchema(value as any, option)
      return
    }

    // resolve definitions functions keys
    if (key === '$ref' && isFunction(get(definitions, value))) {
      delete schema.$ref
      schema = get(definitions, value)(schema) || { type: 'lib-omit' }
      return
    }

    // resolve preset keys
    const presetRefType =
      key === '$preset'
        ? 'key'
        : typeof value === 'string' && value.indexOf('$preset.') === 0
        ? 'value'
        : ''

    if (!presetRefType) {
      return
    }

    const isKeyRef = presetRefType === 'key'
    const presetVal = get(preset, isKeyRef ? value : value.replace('$preset.', ''))
    const logStr = ` [${key}: ${value}] 请检查 ${nodePath}/preset 或者 schema.preset`

    if (!presetVal) {
      log.warn('$preset 不存在。', logStr)
      return
    }

    if (!isKeyRef) {
      schema[key] = presetVal
      return
    }

    if (!isObject(presetVal)) {
      log.warn('$preset为key时，只能引用object值。', logStr)
      return
    }

    delete schema.$preset
    schema = { ...presetVal, ...schema }
  })

  return schema
}

// 处理自定义格式
export const resolveLibSchema = (schema: LibSchema) => {
  const { preset = {}, definitions, constants, ...rest } = schema

  if (isEmpty(preset) && isEmpty(definitions) && !constants) {
    return { ...rest, definitions }
  }

  const reformSchema = { definitions, preset, ...rest }
  const amisSchema = convertToAmisSchema(reformSchema, { definitions, preset, constants })
  const authSchema: any = omit(amisSchema, ['preset'])

  filterSchemaLimit(authSchema, preset)

  return authSchema
}

// 自定义解析器
export const libResolver = (path: string, schema?: Schema): null | RendererConfig => {
  return resolveRenderer(path, schema)
}

// 顶层有 type 与 css 属性， 自动注入 lib-css
export const wrapCss = (schema: LibSchema) => {
  const { css: getCss, tag, htmlClassName, definitions, constants, preset, ...rest } = schema

  if (!getCss && !tag && !htmlClassName) {
    return schema
  }

  return {
    tag,
    preset,
    definitions,
    constants,
    htmlClassName,
    body: rest,
    css: getCss,
    type: 'lib-css',
  }
}
