import { createContext, useContext } from 'react'
import { types } from 'mobx-state-tree'
import { get, map, isPlainObject, isArray, isObject, isObjectLike } from 'lodash'
import Baobab from 'baobab'

import { idKey, nodes } from '@/constants'

import { getIdKeyPath, parseSchema, getRenderSchema } from './utils'

// 根节点
const Preview = types
  .model('PreviewState', {
    // 移动悬浮的ID
    hoverId: types.maybeNull(types.string),
    // 选中的ID
    selectedId: types.maybeNull(types.string),
  })
  .volatile((self) => ({
    // 真实携带所有的配置
    schema: {},
  }))
  .views((self) => {
    // 用于代码展示文本
    const getCodeText = () => {}

    const getNodeInfo = (schema) => {
      const { type } = schema
      const info = {
        type,
        schema,
        node: get(nodes, `${type}.selectProps`) || {},
      }
      return info
    }

    return {
      // 渲染需要的 配置
      get renderSchema() {
        return getRenderSchema(self)
      },
      // 代码显示文本
      get codeText() {
        return getCodeText()
      },
      // baobab 对象
      get baobabSchema() {
        return new Baobab(self.schema || {})
      },

      // 悬浮的 node 游标
      get hoverCursor() {
        const hoverKeyPath = getIdKeyPath(self.schema, self.hoverId)
        return self.baobabSchema.select(hoverKeyPath)
      },

      // 悬浮的 node 信息
      get hoverInfo() {
        if (!self.hoverId) {
          return {}
        }

        return getNodeInfo(self.hoverCursor.get())
      },

      // 选中 node的 游标
      get selectedCursor() {
        const selectedKeyPath = getIdKeyPath(self.schema, self.selectedId)
        return self.baobabSchema.select(selectedKeyPath)
      },

      // 选中 node的 信息
      get selectedInfo() {
        if (!self.selectedId) {
          return {}
        }

        return getNodeInfo(self.selectedCursor.get())
      },
    }
  })
  .actions((self) => {
    const setRawSchema = (schema) => {
      self.schema = schema
    }

    const setSchema = (schema, isClone) => {
      parseSchema(self, schema, isClone)
    }

    const saveBaobabSchema = (cursor) => {
      setSchema(cursor.root().get())
    }

    const setHoverId = (id) => {
      self.hoverId = id
    }

    const setSelectedId = (id) => {
      self.selectedId = id
    }

    return {
      setRawSchema,
      setSchema,
      saveBaobabSchema,
      setHoverId,
      setSelectedId,
    }
  })

const PreviewContext = createContext(null)

export const PreviewProvider = PreviewContext.Provider

export const usePreviewStore = () => {
  return useContext(PreviewContext)
}

export const previewStore = Preview.create({})

export const initialStore = {
  type: 'page',
  title: 'test',
  body: {
    type: 'html',
    html: '123',
  },
}

previewStore.setSchema(initialStore)
