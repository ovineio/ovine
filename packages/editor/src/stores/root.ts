import _ from 'lodash'
import { types, getEnv } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

import { baseAmisEnv } from '@core/components/amis/schema/amis'

import { EditorProps } from '@/components/app/types'

import { editorStore } from './editor'

const RootStore = types
  .model('RootStore', {
    isPreview: types.boolean,
    hasPrevStep: types.boolean,
    hasNextStep: types.boolean,
    lastSavedSchema: types.frozen({}),
    option: types.frozen<EditorProps>({}),
  })
  .views((self) => {
    return {
      // 脏数据检查，如果未保存的数据，给出适当提示 https://blog.csdn.net/big1989wmf/article/details/70144000
      get isDirty() {
        return !_.isEqual(editorStore.schema, self.lastSavedSchema)
      },
      get fetcher() {
        return getEnv(self).fetcher
      },
      get notify() {
        return getEnv(self).notify
      },
      get alert() {
        return getEnv(self).alert
      },
      get copy() {
        return getEnv(self).copy
      },
    }
  })
  .actions((self) => {
    const setHistoryStatus = (status: { prev: boolean; next: boolean }) => {
      self.hasPrevStep = status.prev
      self.hasNextStep = status.next
    }

    const togglePreview = (toggle?: any) => {
      self.isPreview = typeof toggle === 'boolean' ? toggle : !self.isPreview
    }

    const setLastSavedSchema = (schema) => {
      self.lastSavedSchema = schema
    }

    const setOption = (option: EditorProps) => {
      const { getSchema } = option

      if (getSchema) {
        const source = getSchema()
        editorStore.updateSchema(source)
        setLastSavedSchema(source)
      }

      self.option = option
    }

    return {
      setOption,
      setHistoryStatus,
      togglePreview,
      setLastSavedSchema,
    }
  })

const Root = createContext(null)

export const rootStore = RootStore.create(
  {
    isPreview: false,
    hasPrevStep: false,
    hasNextStep: false,
  },
  {
    /**
     * amis 要求必须实现的操作
     */
    ...baseAmisEnv,
    updateLocation: () => {
      //
    },
    jumpTo() {
      //
    },
  } as any
)

export const RootProvider = Root.Provider

export const useRootStore = (): typeof rootStore => {
  return useContext(Root)
}
