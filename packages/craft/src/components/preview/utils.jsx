import React from 'react'

import {
  get,
  includes,
  isEmpty,
  isObjectLike,
  keys,
  map,
  omit,
  cloneDeep,
  uniqueId,
  isArray,
  isPlainObject,
} from 'lodash'

import { idKey } from '@/constants'
import { asideStore } from '@/components/aside/store'
import history from '@/stores/history'
import indicator from '../aside/indicator'

const getEditNodeInfo = (type) => {
  const nodeConf = {
    dialog: {
      text: '弹窗',
    },
    drawer: {
      text: '抽屉',
    },
  }

  if (includes(Object.keys(nodeConf), type)) {
    return nodeConf[type]
  }

  return false
}

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
      if (found) {
        return
      }
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

// 获取 渲染时 配置
export function getRenderSchema(self) {
  const cursor = self.editCursor
  const schema = cursor.get()

  // 异常数据
  if (!isObjectLike(schema) || isEmpty(schema)) {
    return {
      type: 'tpl',
      tpl: '请输入有效 schema',
    }
  }

  if (!getEditNodeInfo(schema.type)) {
    return schema
  }

  const Component = ({ children }) => <div data-id={schema.$dataId}>{children}</div>

  cursor.set('wrapperComponent', Component)

  return cursor.get()
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

    const item = { children: [] }

    if (isArray(node)) {
      item.type = 'array'
      item.id = `none-${uniqueId()}`
      items.push(item)
    } else {
      const type = get(node, 'type')

      // 将每一个有 type 属性的渲染器，与 id 标记
      const omitEditNode = getEditNodeInfo(schema.type) || !getEditNodeInfo(type)
      if (type && omitEditNode && !!node.$dataId) {
        item.type = type
        item.id = node.$dataId
        items.push(item)
      }
    }

    map(node, (subNode) => {
      travel(subNode, item.children)
    })
  }

  travel(schema, nodes)

  return nodes
}

// 获取需要独立编辑的 节点
export function getEditNodes(schema) {
  const nodes = [
    {
      id: '',
      label: '页面',
    },
  ]

  if (!isObjectLike(schema)) {
    return nodes
  }

  // 遍历设置
  const travel = (node) => {
    if (!isObjectLike(node)) {
      return
    }

    const type = get(node, 'type')
    const id = get(node, '$dataId')
    const info = getEditNodeInfo(type)
    // 将每一个有 type 属性的渲染器，添加 id 标记
    if (type && id && info) {
      nodes.push({
        id,
        // TODO: label 需要优化 更明确的 标示
        label: `${info.text}-${node.title || id}`,
      })
    }

    map(node, travel)
  }

  travel(schema)

  return nodes
}

// 处理数据 原始 schema 数据
// TODO: 补全省略的 type
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
