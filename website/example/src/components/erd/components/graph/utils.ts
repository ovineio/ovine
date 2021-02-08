import { store } from '../../store'
import Node from './node'

export const getNodesData = (source) => {
  const nodes = source.map((node) => {
    const item: any = {
      id: node.id,
      render: Node,
      data: node,
    }

    if (node.x && node.y) {
      item.left = node.x
      item.top = node.y
    }

    return item
  })
  return nodes
}

export const getEdgesData = (edges) => {
  return edges
}

export const addNode = (e: React.MouseEvent) => {
  const { pageX, pageY } = e
  const { top, left } = e.currentTarget.getBoundingClientRect()

  const { graph, model } = store
  const { toggleAddMode, canvas } = graph
  const [offX, offY] = canvas.getOffset()

  const x = pageX - left
  const y = pageY - top

  // TODO: 当缩放时 需要 等比计算初初始比例
  const nodeId = model.addTable({
    x: x - offX,
    y: y - offY,
  })

  setTimeout(() => {
    store.setActiveId(nodeId)
  }, 100)

  toggleAddMode()
}
