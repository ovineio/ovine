import { EditorState } from '../types/editor'
import { NodeId } from '../types/nodes'
import { NodeHelpers } from './node_helper'

export function QueryMethods(state: EditorState) {
  return {
    /**
     * Helper methods to describe the specified Node
     * @param id
     */
    node(id: NodeId) {
      return NodeHelpers(state, id)
    },
  }
}
