import { findIndex, get } from 'lodash'
import { types } from 'mobx-state-tree'
import React, { createContext, useContext } from 'react'

import { rmActiveEndpoint } from '../components/graph/canvas'

import { AsideModel, asideStore } from './aside'
import { graphModel, graphStore } from './graph'
import { DataModel, modelStore } from './model'

const RootModel = types
  .model('ErdRootModel', {
    activeId: '',
    activeFieldId: '',
    graph: graphModel,
    aside: AsideModel,
    model: DataModel,
  })
  .views((self) => {
    const getActiveNodeInfo = () => {
      if (!self.activeId) {
        return
      }
      const nodeInfo = self.model.tables.find((i) => i.id === self.activeId)
      return nodeInfo
    }

    return {
      get canActiveItem() {
        return !self.graph.addMode && !self.aside.sortToggle
      },

      get canEditItem() {
        return (
          !self.graph.addMode &&
          !self.aside.sortToggle &&
          !self.aside.withSearch &&
          !self.graph.readMode
        )
      },

      get hasActiveItem() {
        return self.activeFieldId || self.activeId
      },
      get activeNodeInfo() {
        return getActiveNodeInfo()
      },

      get activeFieldInfo() {
        const nodeInfo = getActiveNodeInfo()
        const field = nodeInfo?.fields.find((i) => i.id === self.activeFieldId)

        if (!field) {
          return
        }

        field.setTableInfo({
          id: nodeInfo.id,
        })

        return field
      },
      get activeItemNavInfo() {
        const info = {
          pre: false,
          next: false,
          in: false,
          out: false,
          index: 0,
        }
        const fields = getActiveNodeInfo()?.fields || []
        const fieldCount = fields.length

        if (self.activeFieldId) {
          const fieldIndex = findIndex(fields, { id: self.activeFieldId })

          info.out = true
          info.index = fieldIndex
          if (fieldIndex !== -1 && fieldCount !== 1) {
            info.pre = fieldIndex !== 0
            info.next = fields.length - 1 !== fieldIndex
          }
        } else if (self.activeId) {
          const { orderedTables: tables } = self.model
          const tableIndex = findIndex(tables, { id: self.activeId })
          info.index = tableIndex
          info.in = fieldCount !== 0
          if (tableIndex !== -1 && tables.length !== 1) {
            info.pre = tableIndex !== 0
            info.next = tables.length - 1 !== tableIndex
          }
        }

        return info
      },
    }
  })
  .actions((self) => {
    const setActiveFieldId = (id: string = '') => {
      self.activeFieldId = id && self.canActiveItem ? id : ''
    }

    const setActiveId = (id: string = '') => {
      // 保持 fieldId 与 nodeId 一致性
      if (self.activeFieldInfo && self.activeFieldInfo?.tableInfo.id !== id) {
        setActiveFieldId()
      }

      self.activeId = id && self.canActiveItem ? id : ''
    }

    const navigateActiveItem = (direction: 'in' | 'out' | 'pre' | 'next', index: number = 0) => {
      if (direction === 'in') {
        const nextId = get(self.activeNodeInfo, 'fields[0].id')
        setActiveFieldId(nextId)
        return
      }

      if (direction === 'out') {
        setActiveFieldId()
        return
      }

      if (self.activeFieldId) {
        const nextId = get(self.activeNodeInfo, `fields[${index}].id`)
        setActiveFieldId(nextId)
        return
      }

      if (self.activeId) {
        const nextId = get(self.model, `orderedTables[${index}].id`)
        self.graph.canvas.focusNodeWithAnimate(nextId)
        setActiveId(nextId)
      }
    }

    const clearActive = () => {
      rmActiveEndpoint()
      if (self.hasActiveItem) {
        setActiveFieldId()
        setActiveId()
      }
    }

    return {
      setActiveFieldId,
      setActiveId,
      clearActive,
      navigateActiveItem,
    }
  })

export const store = RootModel.create({
  aside: asideStore,
  graph: graphStore,
  model: modelStore,
})

const ErdContext = createContext(store)

export const useStore = () => useContext(ErdContext)

export const Provider = ({ children }) => {
  return <ErdContext.Provider value={store}>{children}</ErdContext.Provider>
}
