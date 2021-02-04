import { types } from 'mobx-state-tree'
import React, { createContext, useContext, useEffect } from 'react'

import { modelUtils } from '../helper/api'

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
      get activeNodeInfo() {
        return getActiveNodeInfo()
      },
      get activeFieldInfo() {
        const nodeInfo = getActiveNodeInfo()

        if (!nodeInfo) {
          return
        }

        const field = nodeInfo.fields.find((i) => i.id === self.activeFieldId)

        return field
      },
    }
  })
  .actions((self) => {
    const setActiveFieldId = (id: string) => {
      self.activeFieldId = id
    }

    const setActiveId = (id: string) => {
      self.activeId = id
    }

    return {
      setActiveFieldId,
      setActiveId,
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
  useEffect(() => {
    modelUtils.fetchModelTplData()
  }, [])
  return <ErdContext.Provider value={store}>{children}</ErdContext.Provider>
}
