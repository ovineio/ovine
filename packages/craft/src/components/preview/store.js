import { createContext, useContext } from 'react'
import { types } from 'mobx-state-tree'
import { get, map, isPlainObject, isArray, isObject, isObjectLike } from 'lodash'
import Baobab from 'baobab'

import { publish } from '@core/utils/message'

import { idKey, message, nodes } from '@/constants'

import { asideStore } from '@/components/aside/store'

import { getIdKeyPath, parseSchema, getRenderSchema, getAllNodes } from './utils'

// 根节点
const Preview = types
  .model('PreviewState', {
    // 移动悬浮的ID
    hoverId: types.optional(types.string, ''),
    // 选中的ID
    selectedId: types.optional(types.string, ''),
    // 当前编辑的 schema 对于 root 的路径, 默认 空数组，表示直接编辑根节点
    editPath: types.optional(types.array(types.string), []),
  })
  .volatile((self) => ({
    // 页面内所有操作 --- 预览时屏蔽所有操作
    actions: [],
    // 所有弹窗 ---- 弹窗内容要另外编辑
    dialogs: [],
    // 处于预览激活状态的 --- schema
    schema: {},
    // 根节点----整个页面完整的JSON配置
    root: {},
  }))
  .views((self) => {
    // 用于代码展示文本
    const getCodeText = () => {}

    const getNodeInfo = (schema = {}) => {
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

      get schemaNodes() {
        return getAllNodes(self.schema)
      },
    }
  })
  .actions((self) => {
    const setRawSchema = (schema) => {
      self.schema = schema.toJSON ? schema.toJSON() : schema
      asideStore.setNodes(self.schemaNodes)
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
      const prevId = self.selectedId
      // const prevInfo = self.selectedInfo
      self.selectedId = id

      // selectId 有变化就发送消息，方便全局其他地方处理
      _.throttle(() => {
        if (prevId !== id) {
          publish(message.updateSelected, self.selectedInfo)
        }
      }, 100)()
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

// 用于测试的 schema
export const initialStore = {
  type: 'page',
  title: 'test',
  body: [
    {
      type: 'html',
      html: '123',
    },
    {
      type: 'form',
      api: 'https://houtai.baidu.com/api/mock2/form/saveForm',
      controls: [
        {
          type: 'text',
          name: 'name',
          label: '姓名：',
        },
      ],
    },
    {
      label: '弹框',
      type: 'action',
      actionType: 'dialog',
      dialog: {
        title: '打开弹框',
        body: '这是个简单的弹框。',
      },
    },
  ],
}

previewStore.setSchema(initialStore)
