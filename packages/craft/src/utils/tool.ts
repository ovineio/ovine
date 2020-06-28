import { map } from 'lodash'

import { EditorState } from '@/types/editor'
import { Node, NodeTree, NodeId, NodeEvents } from '@/types/nodes'

const mergeNodes = (rootNode: Node, childrenNodes: NodeTree[]) => {
  if (childrenNodes.length < 1) {
    return { [rootNode.id]: rootNode }
  }
  const nodes = childrenNodes.map(({ rootNodeId }) => rootNodeId)
  const nodeWithChildren = { ...rootNode, data: { ...rootNode.data, nodes } }
  const rootNodes = { [rootNode.id]: nodeWithChildren }
  return childrenNodes.reduce((accum: any, tree: any) => {
    const currentNode = tree.nodes[tree.rootNodeId]
    return {
      ...accum,
      ...tree.nodes,
      // set the parent id for the current node
      [currentNode.id]: {
        ...currentNode,
        data: {
          ...currentNode.data,
          parent: rootNode.id,
        },
      },
    }
  }, rootNodes)
}

export const updateEventsNode = (state: EditorState, id: NodeId, toDelete?: boolean) => {
  map(state.events, (val, key) => {
    if (key && val === id) {
      state.events[key as NodeEvents] = toDelete ? null : id
    }
  })
}

export const mergeTrees = (rootNode: Node, childrenNodes: NodeTree[]): NodeTree => ({
  rootNodeId: rootNode.id,
  nodes: mergeNodes(rootNode, childrenNodes),
})
