import Node from './node'

export const getNodesData = (source) => {
  const nodes = source.map((node) => {
    return {
      id: node.id,
      render: Node,
      data: node,
    }
  })
  return nodes
}

export const getEdgesData = (edges) => {
  return edges
}
