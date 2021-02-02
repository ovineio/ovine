import Edge from '../coms/edge'
import Group from '../coms/group'
import Node from '../coms/node'

const process = ({ nodes = [], edges = [], groups = [] }) => {
  return {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: Node,
      }
    }),
    edges: edges.map((edge) => {
      const labelDOM = document.createElement('div')
      labelDOM.id = edge.id

      return {
        ...edge,
        type: 'endpoint',
        Class: Edge,
      }
    }),
    groups: groups.map((group) => {
      return {
        ...group,
        Class: Group,
      }
    }),
  }
}

export default process
