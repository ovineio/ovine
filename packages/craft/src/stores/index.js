import { types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

// 根节点
const Root = types
  .model('Root', {
    // 编辑器模式
    mode: types.enumeration('mode', ['edit', 'stage']),
  })
  .views((self) => {
    return {
      get isEditMode() {
        return self.mode === 'edit'
      },
      get isStageMode() {
        return self.mode === 'stage'
      },
    }
  })
  .actions((self) => {
    const setMode = (mode) => {
      self.mode = mode
    }

    return {
      setMode,
    }
  })

const RootContext = createContext(null)

export const RootProvider = RootContext.Provider

export const useRootStore = () => {
  return useContext(RootContext)
}

export const rootStore = Root.create({
  mode: 'edit',
})
