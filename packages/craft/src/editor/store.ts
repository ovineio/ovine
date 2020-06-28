import { Options } from '@/types/editor'
import { useMethods, SubscriberAndCallbacksFor } from '@/utils/use_methods'

import { Actions } from './actions'
import { QueryMethods } from './query'

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>

export const editorInitialState = {
  nodes: {},
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
