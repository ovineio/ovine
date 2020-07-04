import { Options } from '@/types/editor'
import { useMethods, SubscriberAndCallbacksFor } from '@/utils/use_methods'

import { Actions } from './actions'
import { QueryMethods } from './query'

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>

export const editorInitialState = {
  nodes: {},
  schema: {},
  layout: {
    unfoldCode: true, // 展开 code 代码编辑
    unfoldReference: true, // 展开属性关联
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
