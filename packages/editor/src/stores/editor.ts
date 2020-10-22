import { types } from 'mobx-state-tree'

import { history } from './history'

const initSchema = {
  type: 'page',
  title: '一个全新的页面',
  body: '从这里开始编辑吧～',
}

const EditorStore = types
  .model('EditorStore', {
    schema: types.frozen({}),
  })
  .actions((self) => {
    const rawUpdateSchema = (schema: any) => {
      self.schema = schema
    }

    const updateSchema = (schema: any) => {
      history.addFrame(schema)
      self.schema = schema
    }

    return {
      updateSchema,
      rawUpdateSchema,
    }
  })

export const editorStore = EditorStore.create({ ...initSchema })
