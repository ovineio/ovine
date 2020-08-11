import { EditorState } from '@/types/editor'
import { NodeId } from '@/types/nodes'
import { rootNode } from '@/utils/constants'

import { mergeTrees } from '@/utils/tool'

export function NodeHelpers(state: EditorState, id: NodeId) {
  const node = state.nodes[id]

  const nodeHelpers = (nodeId: string) => NodeHelpers(state, nodeId)

  return {
    get() {
      return node
    },
    isRoot() {
      return node.id === rootNode
    },
    isLinkedNode() {
      return (
        node.data.parent &&
        nodeHelpers(node.data.parent)
          .linkedNodes()
          .includes(node.id)
      )
    },
    isTopLevelNode() {
      return this.isRoot() || this.isLinkedNode()
    },
    isDeletable() {
      return !this.isTopLevelNode()
    },
    isParentOfTopLevelNodes: () => !!node.data.linkedNodes,
    isParentOfTopLevelCanvas() {
      return this.isParentOfTopLevelNodes()
    },
    ancestors(deep = false) {
      function appendParentNode(nodeId: NodeId, result: NodeId[] = [], depth: number = 0) {
        const thisNode = state.nodes[nodeId]
        if (!thisNode) {
          return result
        }

        result.push(nodeId)

        if (!thisNode.data.parent) {
          return result
        }

        if (deep || (!deep && depth === 0)) {
          result = appendParentNode(thisNode.data.parent, result, depth + 1)
        }
        return result
      }
      return appendParentNode(node.data.parent as any)
    },
    descendants(deep = false) {
      function appendChildNode(nodeId: NodeId, result: NodeId[] = [], depth: number = 0) {
        if (deep || (!deep && depth === 0)) {
          const thisNode = state.nodes[nodeId]

          if (!thisNode) {
            return result
          }

          // Include linkedNodes if any
          const linkedNodes = nodeHelpers(nodeId).linkedNodes()

          linkedNodes.forEach((linkNodeId: any) => {
            result.push(linkNodeId)
            result = appendChildNode(linkNodeId, result, depth + 1)
          })

          const childNodes = thisNode.data.nodes

          if (!childNodes) {
            return result
          }

          // Include child Nodes if any
          if (childNodes) {
            childNodes.forEach((linkNodeId: any) => {
              result.push(linkNodeId)
              result = appendChildNode(linkNodeId, result, depth + 1)
            })
          }
        }
        return result
      }
      return appendChildNode(id)
    },
    linkedNodes() {
      return Object.values(node.data.linkedNodes || {})
    },
    toNodeTree() {
      const childNodes: any = (node.data.nodes || []).map((childNodeId: any) => {
        return NodeHelpers(state, childNodeId).toNodeTree()
      })

      return mergeTrees(node, childNodes)
    },
  }
}
