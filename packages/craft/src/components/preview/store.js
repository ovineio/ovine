import Baobab from 'baobab'
import _ from 'lodash'
import { types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

import { publish } from '@core/utils/message'

import { asideStore } from '@/components/aside/store'
import { message, nodes } from '@/constants'
import history from '@/stores/history'

import { getIdKeyPath, getRenderSchema, getAllNodes, getEditNodes, setSchemaNodeId } from './utils'

// 根节点
const Preview = types
  .model('PreviewState', {
    // 移动悬浮的ID
    hoverId: types.optional(types.string, ''),
    // 选中的ID
    selectedId: types.optional(types.string, ''),
    // 当前编辑的 nodeId
    editId: types.optional(types.string, ''),
  })
  .volatile(() => ({
    schema: {},
    // 被用于粘贴的 schema
    clipboard: {},
  }))
  .views((self) => {
    // 用于代码展示文本
    const getCodeText = () => {}

    const getNodeInfo = (schema = {}) => {
      const { type } = schema
      const info = {
        type,
        schema,
        node: _.get(nodes, `${type}.selectProps`) || {},
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

      // 悬浮的 node 信息
      get hoverInfo() {
        if (!self.hoverId) {
          return {}
        }
        const hoverKeyPath = getIdKeyPath(self.schema, self.hoverId)
        const hoverCursor = self.baobabSchema.select(hoverKeyPath)
        return getNodeInfo(hoverCursor.get())
      },

      // 选中 node的 游标
      get selectedCursor() {
        const selectedKeyPath = getIdKeyPath(self.schema, self.selectedId)
        return self.baobabSchema.select(selectedKeyPath)
      },

      // 编辑的 node的 游标
      get editCursor() {
        if (!self.editId) {
          return self.baobabSchema
        }

        const selectedKeyPath = getIdKeyPath(self.schema, self.editId)
        return self.baobabSchema.select(selectedKeyPath)
      },

      // 选中 node的 信息
      get selectedInfo() {
        if (!self.selectedId) {
          return {}
        }
        return getNodeInfo(self.selectedCursor.get())
      },

      get clipboardSchema() {
        // 每次都更新 nodeId 多次复制
        const schema = setSchemaNodeId(self.clipboard, {
          isClone: true,
          forceUpdate: true,
        })

        return schema
      },
    }
  })
  .actions((self) => {
    const setRawSchema = (schema) => {
      if (!_.isObjectLike(schema)) {
        return
      }

      self.schema = schema.toJSON ? schema.toJSON() : schema

      // 关联 侧边栏数据
      asideStore.setNodes(getAllNodes(self.renderSchema))
      asideStore.setNavs(getEditNodes(self.schema))
    }

    const setSchema = (schema, option = {}) => {
      const { addNodeId = false, isClone = false } = option
      let newSchema = schema

      // 需要遍历设置 nodeID
      if (addNodeId) {
        newSchema = setSchemaNodeId(schema, { isClone })
      }

      // 加入历史记录
      history.addFrame({
        selectedId: self.selectedId,
        schema: _.cloneDeep(newSchema),
      })

      setRawSchema(newSchema)
    }

    const saveBaobabSchema = (cursor) => {
      const schema = cursor.root().get()
      setSchema(schema)
    }

    const setHoverId = (id = '', sponsor = 'preview') => {
      const prevId = self.hoverId
      self.hoverId = id

      // hoverId 有变化就发送消息，方便全局其他地方处理
      _.throttle(() => {
        if (prevId !== id) {
          publish(message.updateHover, {
            sponsor,
            id,
            info: self.hoverInfo,
          })
        }
      }, 100)()
    }

    const setSelectedId = (id = '', sponsor = 'preview') => {
      const prevId = self.selectedId
      self.selectedId = id

      // selectId 有变化就发送消息，方便全局其他地方处理
      _.throttle(() => {
        if (prevId !== id) {
          publish(message.updateSelected, {
            sponsor,
            id,
            info: self.selectedInfo,
          })
        }
      }, 100)()
    }

    const setEditId = (id) => {
      self.selectedId = ''
      self.hoverId = ''
      self.editId = id
      asideStore.setNodes(getAllNodes(self.renderSchema))
    }

    const setClipboard = () => {
      const schema = self.selectedCursor.deepClone()
      self.clipboard = schema
    }

    return {
      setRawSchema,
      setSchema,
      saveBaobabSchema,
      setHoverId,
      setEditId,
      setSelectedId,
      setClipboard,
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
  title: '编辑器体验版',
  subTitle: '现在只能 page 中，添加 “按钮” 组件， 或者 选中后，使用右键操作。',
  remark: '正在加油赶工中...',
  body: [
    {
      type: 'html',
      html: '这是一个未完成版的编辑器，全部功能完成后，将逐步无缝对接到ovine中。',
    },
    {
      label: '测试示例',
      type: 'action',
      className: 'm-md',
      actionType: 'dialog',
      dialog: {
        type: 'dialog',
        title: '测试示例',
        body: {
          type: 'form',
          title: '常规模式',
          mode: 'normal',
          controls: [
            {
              type: 'text',
              name: 'name',
              label: '姓名：',
            },
            {
              name: 'email',
              type: 'email',
              label: '邮箱：',
            },
          ],
        },
      },
    },
    {
      type: 'form',
      title: '表单示例',
      mode: 'horizontal',
      controls: [
        {
          type: 'text',
          name: 'name',
          label: '姓名：',
        },
        {
          name: 'email',
          type: 'email',
          label: '邮箱：',
        },
      ],
    },
  ],
}

previewStore.setSchema(initialStore, { addNodeId: true })
