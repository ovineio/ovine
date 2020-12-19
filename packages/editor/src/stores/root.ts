import { toast } from 'amis'
import { isEmpty, isEqual } from 'lodash'
import { types } from 'mobx-state-tree'

import { app } from '@core/app'

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
        if (isEmpty(self.lastSavedSchema)) {
          return false
        }
        return !isEqual(editorStore.schema, self.lastSavedSchema)
      },
      /**
       * 以下内容主要用于 amis-editor 中的 store 获取 env
       */
      // get fetcher() {
      //   return getEnv(self).fetcher
      // },
      // get notify() {
      //   return getEnv(self).notify
      // },
      // get alert() {
      //   return getEnv(self).alert
      // },
      // get copy() {
      //   return getEnv(self).copy
      // },
      // get isCancel() {
      //   return getEnv(self).isCancel
      // },
      // get updateLocation() {
      //   return getEnv(self).updateLocation
      // },
      // get jumpTo() {
      //   return getEnv(self).jumpTo
      // },
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
      const { initApi, getSchema, schema } = option

      if (schema) {
        editorStore.updateSchema(schema)
      }

      if (getSchema) {
        editorStore.updateSchema(getSchema())
      }

      if (initApi) {
        app
          .request(initApi)
          .then((source) => {
            const { status, data, msg } = source.data
            if (status !== 0) {
              toast.error(msg || '获取数据失败')
            }
            editorStore.updateSchema(data || { type: 'page', body: '暂无数据' })
          })
          .catch(() => {
            toast.error('获取数据失败')
          })
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
