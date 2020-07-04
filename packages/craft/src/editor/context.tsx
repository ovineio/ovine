import React, { createContext, useEffect, useContext, useMemo } from 'react'

import { NodeId } from '@/types/nodes'
import { useCollector } from '@/utils/use_collector'

import { Options } from '../types/editor'
import { EditorStore, useEditorStore } from './store'

export type EditorContext = EditorStore
export const EditorContext = createContext<EditorContext>({} as EditorContext)

/**
 * A React Component that provides the Editor context
 */
export const Editor: React.FC<Partial<Options>> = ({ children, ...options }) => {
  const context = useEditorStore({
    onRender: ({ render }) => render,
    resolver: {},
    enabled: true,
    ...options,
  })

  useEffect(() => {
    if (context && options) {
      context.actions.setOptions((editorOptions: any) => {
        editorOptions = options
        return editorOptions
      })
    }
  }, [context, options])

  return <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
}

export function useInternalEditor(collector?: any) {
  const store = useContext(EditorContext)
  const collected = useCollector(store, collector)

  return {
    ...(collected as any),
    inContext: !!store,
    store,
  }
}

export function useEditor(collect?: any) {
  const {
    connectors,
    actions: { setNodeEvent, ...editorActions },
    query: { ...query },
    store, // eslint-disable-line
    ...collected
  } = useInternalEditor(collect)

  const actions = useMemo(() => {
    return {
      ...editorActions,
      selectNode: (nodeId: NodeId | null) => {
        setNodeEvent('selected', nodeId)
        setNodeEvent('hovered', null)
      },
    }
  }, [editorActions, setNodeEvent])

  return {
    connectors,
    actions,
    query,
    ...(collected as any),
  }
}
