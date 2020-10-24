import _ from 'lodash'
import { types, getEnv } from 'mobx-state-tree'

import { EditorProps } from '@/components/app/types'

import { editorStore } from './editor'

const initState = {
  isPreview: false,
  editorInstance: {
    canUndo: () => {},
    canRedo: () => {},
    undo: () => {},
    redo: () => {},
  },
}

const RootStore = types
  .model('RootStore', {
    isPreview: types.boolean,
    // hasPrevStep: types.boolean,
    // hasNextStep: types.boolean,
    lastSavedSchema: types.frozen({}),
    editorInstance: types.frozen<any>({}),
    option: types.frozen<EditorProps>({}),
  })
  .views((self) => {
    return {
      // 脏数据检查，如果未保存的数据，给出适当提示 https://blog.csdn.net/big1989wmf/article/details/70144000
      get isDirty() {
        return !_.isEqual(editorStore.schema, self.lastSavedSchema)
      },
      /**
       * 以下内容主要用于 amis-editor 中的 store 获取 env
       */
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
      get updateLocation() {
        return getEnv(self).copy
      },
      get jumpTo() {
        return getEnv(self).copy
      },
    }
  })
  .actions((self) => {
    // const setHistoryStatus = (status: { prev: boolean; next: boolean }) => {
    //   self.hasPrevStep = status.prev
    //   self.hasNextStep = status.next
    // }

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
      }

      self.option = option
    }

    const setEditorInstance = (instance: any) => {
      if (!instance) {
        self.editorInstance = initState.editorInstance
        return
      }
      const ins: any = {}
      ;['canUndo', 'canRedo', 'undo', 'redo'].forEach((item) => {
        ins[item] = instance[item].bind(instance)
      })
      self.editorInstance = ins
    }

    return {
      setOption,
      // setHistoryStatus,
      togglePreview,
      setLastSavedSchema,
      setEditorInstance,
    }
  })

export const rootStore = RootStore.create(initState)
