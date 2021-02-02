import { types } from 'mobx-state-tree'
import React, { createContext, useContext } from 'react'

const RootModel = types
  .model({
    hoverId: '',
    activeId: '',
    readOnly: false,
    clickLink: false,
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

    const setHoverId = (id: string) => {
      self.hoverId = id
    }

    const setActiveId = (id: string) => {
      self.activeId = id
    }

    // TODO: 1. setLinkable(true) 时会移除所有的锚点
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

    return {
      setCanvas,
      setHoverId,
      setActiveId,
      toggleReadOnly,
      toggleClickLink,
    }
  })

export const store = RootModel.create({})

const ErdContext = createContext(store)

export const useStore = () => useContext(ErdContext)

export const Provider = ({ children }) => {
  return <ErdContext.Provider value={store}>{children}</ErdContext.Provider>
}
