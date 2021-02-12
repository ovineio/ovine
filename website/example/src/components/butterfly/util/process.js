// import Edge from '../coms/edge'
import Group from '../coms/group'
import Node from '../coms/node'

const process = ({ nodes = [], edges = [], groups = [] }) => {
  const data = {
    nodes: nodes.map((node) => {
      return {
        ...node,
        Class: Node,
      }
    }),
    edges: edges.map((edge) => {
      return {
        type: 'endpoint',
        // Class: Edge,
        ...edge,
      }
    }),
    groups: groups.map((group) => {
      return {
        ...group,
        Class: Group,
      }
    }),
  }

  return data
}

export default process
