import _ from 'lodash'
import { types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

import { previewStore } from '@/components/preview/store'
import nodes from '@/constants/nodes'

const Reference = types
  .model('ReferenceState', {})
  .volatile(() => ({
    // 选中的配置
    schema: {
      type: 'html',
      html: '请选择编辑对象',
    },
  }))
  .actions((self) => {
    const onChange = _.throttle((__, diff) => {
      const cursor = previewStore.selectedCursor
      cursor.merge(_.omitBy(diff, _.isUndefined))
      previewStore.saveBaobabSchema(cursor)
    }, 100)

    const getTabsSchema = (schema, data) => {
      if (!_.isPlainObject(schema)) {
        return {
          type: 'html',
          html: '请选择编辑对象',
        }
      }

      const titles = {
        base: '常规',
        ui: '外观',
        advance: '高级',
      }

      return {
        type: 'tabs',
        tabsId: _.uniqueId(),
        tabs: _.map(_.cloneDeep(schema), (controls, key) => {
          return {
            title: titles[key],
            body: {
              type: 'form',
              data: _.pick(
                data,
                controls.map((i) => i.name)
              ),
              submitOnChange: true,
              wrapWithPanel: false,
              onChange,
              controls,
            },
          }
        }),
      }
    }

    const setSchema = (schema, isClone = false) => {
      if (!_.isPlainObject(schema) || _.isEmpty(schema)) {
        self.schema = {
          type: 'html',
          html: '请选择编辑对象',
        }
        return
      }

      const { type } = schema
      const node = nodes[type]

      if (!node) {
        self.schema = {
          type: 'html',
          html: `${type} 该类型未注册`,
        }
        return
      }

      const refSchema = getTabsSchema(node.refProps, isClone ? _.cloneDeep(schema) : schema)

      self.schema = refSchema
    }

    return {
      setSchema,
    }
  })

const ReferenceContext = createContext(null)

export const referenceStore = Reference.create({})

export const ReferenceProvider = ReferenceContext.Provider

export const useReferenceStore = () => {
  return useContext(ReferenceContext)
}
