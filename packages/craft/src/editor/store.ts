import { Options } from '@/types/editor'
import { useMethods, SubscriberAndCallbacksFor } from '@/utils/use_methods'

import { Actions } from './actions'
import { QueryMethods } from './query'

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>

const initSchema = {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    api: 'https://houtai.baidu.com/api/mock2/form/saveForm',
    controls: [
      {
        label: 'Name',
        type: 'text',
        name: 'name',
      },
      {
        label: 'Email',
        type: 'email',
        name: 'email',
      },
    ],
  },
}

export const editorInitialState = {
  nodes: {},
  schema: initSchema,
  layout: {
    extendCode: true, // 展开 code 代码编辑
    extendReference: true, // 展开属性关联
    referencePosition: 'aside', // 侧边展示
    previewPosition: 'center', // 预览展示区 左中右
  },
  events: {
    selected: null,
    hovered: null,
  },
}

export const useEditorStore = (options: Options): EditorStore => {
  return useMethods(
    Actions,
    {
      ...editorInitialState,
      options,
    },
    QueryMethods
  )
}
