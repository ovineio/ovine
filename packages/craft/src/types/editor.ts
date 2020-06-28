import React from 'react'

import { QueryMethods } from '@/editor/query'
// import { useInternalEditor } from '@/editor/use_internal_editor'
import { QueryCallbacksFor } from '@/utils/use_methods'

import { Nodes, NodeEvents, NodeId } from './nodes'

export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }>
  onNodesChange: (query: QueryCallbacksFor<typeof QueryMethods>) => void
  resolver: Resolver
  enabled: boolean
}

export type Layout = {
  unfoldCode: boolean
  unfoldReference: boolean
  referencePosition: 'aside' | 'bottom'
  previewPosition: 'left' | 'center' | 'right'
}

export type Resolver = Record<string, string | React.ElementType>

export type EditorEvents = Record<NodeEvents, NodeId | null>

export type EditorState = {
  nodes: Nodes
  events: EditorEvents
  options: Options
}

// export type ConnectedEditor<S = null> = useInternalEditor<S>
