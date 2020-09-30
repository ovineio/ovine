import { createContext, useContext } from 'react'
import { types } from 'mobx-state-tree'
import { get, map, isPlainObject, isArray, isObject, isObjectLike } from 'lodash'
import Baobab from 'baobab'

import { idKey } from '@/constants'

// 根节点
const Root = types.model('Root', {
  // 编辑器模式
  mode: types.enumeration('mode', ['edit', 'stage']),
})

const RootContext = createContext(null)

export const RootProvider = RootContext.Provider

export const useRootStore = () => {
  return useContext(RootContext)
}

export const rootStore = Root.create({
  mode: 'edit',
})
