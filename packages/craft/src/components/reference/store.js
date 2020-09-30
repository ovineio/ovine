import { createContext, useContext } from 'react'
import { types } from 'mobx-state-tree'

import { isPlainObject, map, cloneDeep, omitBy, isUndefined, debounce } from 'lodash'

import nodes from '@/constants/nodes'
import { previewStore } from '@/components/preview/store'

const Reference = types
  .model('ReferenceState', {})
  .volatile((self) => ({
    // 选中的配置
    schema: {
      type: 'html',
      html: '请选择编辑对象',
    },
  }))
  .actions((self) => {
    const onChange = debounce((_, diff) => {
      const cursor = previewStore.selectedCursor
      cursor.merge(omitBy(diff, isUndefined))
      previewStore.saveBaobabSchema(cursor)
    }, 200)

    const getTabsSchema = (schema) => {
      if (!isPlainObject(schema)) {
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
        tabs: map(cloneDeep(schema), (controls, key) => {
          return {
            title: titles[key],
            body: {
              type: 'form',
              submitOnChange: true,
              wrapWithPanel: false,
              onChange,
              controls,
            },
          }
        }),
      }
    }

    const setSchema = (schema) => {
      if (!isPlainObject(schema)) {
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

      const refSchema = {
        ...getTabsSchema(node.refProps),
        data: cloneDeep(schema),
      }

      self.schema = refSchema
    }

    return {
      setSchema,
    }
  })

export const referenceStore = Reference.create({})

const ReferenceContext = createContext(null)

export const ReferenceProvider = ReferenceContext.Provider

export const useReferenceStore = () => {
  return useContext(ReferenceContext)
}
