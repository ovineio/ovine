import { uuid } from 'amis/lib/utils/helper'
import {
  difference,
  get,
  includes,
  isEmpty,
  isObjectLike,
  keys,
  map,
  omit,
  cloneDeep,
} from 'lodash'

import { idKey } from '@/constants'

export function getIdKeyPath(source, nodeId) {
  // console.log('##))==>', source, nodeId)
  if (!isObjectLike(source)) {
    return []
  }
  const path = []
  let found = false

  function search(stack) {
    if (get(stack, idKey) === nodeId) {
      found = true
      return
    }
    map(stack, (value, key) => {
      path.push(key)
      if (isObjectLike(stack[key])) {
        search(value)
        if (found) {
          return
        }
      }
      path.pop()
    })
  }

  search(source)

  return path
}

export function parseSchema(self, sourceSchema, isClone = true) {
  let schema = {}

  // 防止数据篡改
  const source = isClone ? cloneDeep(sourceSchema) : sourceSchema

  // 异常数据
  if (!isObjectLike(source) || isEmpty(source)) {
    const id = uuid()
    self.schema = {
      type: 'tpl',
      $dataId: id,
      tpl: '请输入有效 schema',
    }
    return
  }

  // 遍历设置
  const travel = (node) => {
    if (!isObjectLike(node)) {
      return
    }

    const type = get(node, 'type')

    // 将每一个有 type 属性的渲染器，添加 id 标记
    if (type && !node.$dataId) {
      const id = uuid()
      node.$dataId = id
    }

    map(node, travel)
  }

  travel(source)
  // 设置 处理后的配置
  self.schema = source
}

export function getRenderSchema(self) {
  const source = cloneDeep(self.schema)

  // 异常数据
  if (!isObjectLike(source) || isEmpty(source)) {
    return {
      type: 'tpl',
      tpl: '请输入有效 schema',
    }
  }

  // 遍历设置
  const travel = (stack) => {
    map(stack, (value, key) => {
      if (isObjectLike(value)) {
        travel(value)
        return
      }
      const type = get(value[type])
      // 特殊处理 action button
      if (includes(['action', 'button'], type)) {
        stack[key] = omit(
          stack[key],
          difference(keys(stack[key]), [
            'label',
            'icon',
            'type',
            'level',
            'size',
            'iconClassName',
            'active',
            'activeLevel',
            'activeClassName',
            'block',
          ])
        )
        return
      }
    })
  }

  travel(source)

  return source
}
