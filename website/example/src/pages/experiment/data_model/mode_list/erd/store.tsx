import { types } from 'mobx-state-tree'
import React, { createContext, useContext } from 'react'

const ErdRoot = types.model({
  title: types.string,
})

const erdRoot = ErdRoot.create({
  title: '',
})

const ErdContext = createContext(erdRoot)

export const useStore = () => useContext(ErdContext)

export const Provider = ({ children }) => {
  return <ErdContext.Provider value={erdRoot}>{children}</ErdContext.Provider>
}
