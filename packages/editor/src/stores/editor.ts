import { types } from 'mobx-state-tree'

import { history } from './history'

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

export const editorStore = EditorStore.create({})
