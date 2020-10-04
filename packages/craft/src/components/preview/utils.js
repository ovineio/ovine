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
  uniqueId,
} from 'lodash'

import { idKey } from '@/constants'

import history from '@/stores/history'

// 根据 ID 获取 key 的路径
export function getIdKeyPath(source, nodeId) {
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

// 获取 渲染时 的 配置
export function getRenderSchema(self) {
  const schema = cloneDeep(self.schema)

  // 异常数据
  if (!isObjectLike(schema) || isEmpty(schema)) {
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

  travel(schema)

  return schema
}

// 获取所有的节点信息
export function getAllNodes(schema) {
  // 异常数据
  if (!isObjectLike(schema) || isEmpty(schema)) {
    return []
  }

  const nodes = []

  // 遍历节点
  const travel = (node, items = []) => {
    if (!isObjectLike(node)) {
      return
    }

    const type = get(node, 'type')

    const item = { children: [] }

    // 将每一个有 type 属性的渲染器，与 id 标记
    if (type && !!node.$dataId) {
      item.type = type
      item.id = node.$dataId
      items.push(item)
    }

    map(node, (subNode) => {
      travel(subNode, item.children)
    })
  }

  travel(schema, nodes)

  return nodes
}

// 处理数据 原始 schema 数据
export function parseSchema(self, source, isClone = false) {
  // 防止数据篡改
  const schema = isClone ? cloneDeep(source) : source

  // 异常数据
  if (!isObjectLike(schema) || isEmpty(schema)) {
    self.schema = {
      type: 'tpl',
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
      const id = uniqueId('node-')
      node.$dataId = id
    }

    map(node, travel)
  }

  travel(schema)

  // 加入历史记录
  history.addFrame({
    selectedId: self.selectedId,
    schema: cloneDeep(schema),
  })

  // 设置 处理后的配置
  self.setRawSchema(schema)
}
