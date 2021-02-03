import { types } from 'mobx-state-tree'
import React, { createContext, useContext } from 'react'

import { AsideModel, asideStore } from './aside'

const RootModel = types
  .model('ErdRootModel', {
    activeId: '',
    activeFieldId: '',
    fullScreen: false,
    readOnly: false,
    clickLink: false,
    aside: AsideModel,
  })
  .volatile(() => {
    return {
      canvas: {} as any,
    }
  })
  .actions((self) => {
    const setCanvas = (canvas: any) => {
      self.canvas = canvas
    }

    const setActiveFieldId = (id: string) => {
      self.activeFieldId = id
    }

    const setActiveId = (id: string) => {
      self.activeId = id
    }

    const toggleReadOnly = (toggle?: any) => {
      const isReadOnly = typeof toggle === 'boolean' ? toggle : !self.readOnly

      self.readOnly = isReadOnly

      if (isReadOnly) {
        self.canvas.setLinkable(false)
        self.canvas.setDisLinkable(false)
        self.canvas.setDraggable(false)
      } else {
        self.canvas.setLinkable(true)
        self.canvas.setDisLinkable(true)
        self.canvas.setDraggable(true)
      }
    }

    const toggleClickLink = (toggle?: any) => {
      const isClickLink = typeof toggle === 'boolean' ? toggle : !self.clickLink
      self.clickLink = isClickLink
    }

    const toggleFullScreen = (toggle?: any) => {
      const isFullScreen = typeof toggle === 'boolean' ? toggle : !self.fullScreen
      self.fullScreen = isFullScreen
    }

    return {
      setCanvas,
      setActiveFieldId,
      setActiveId,
      toggleReadOnly,
      toggleClickLink,
      toggleFullScreen,
    }
  })

export const store = RootModel.create({
  aside: asideStore,
})

const ErdContext = createContext(store)

export const useStore = () => useContext(ErdContext)

export const Provider = ({ children }) => {
  return <ErdContext.Provider value={store}>{children}</ErdContext.Provider>
}
