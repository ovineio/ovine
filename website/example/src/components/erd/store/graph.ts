import { types } from 'mobx-state-tree'

// const GroupModel = types.model('ErdGroupModel', {
//   type: types.string, // 'endpoint/node',
//   id: types.string,
//   source: types.string,
//   target: types.string,
//   sourceNode: types.string,
//   targetNode: types.string,
//   arrow: types.maybeNull(types.boolean),
//   arrowPosition: types.maybeNull(types.number),
//   arrowOffset: types.maybeNull(types.number),
//   label: types.maybeNull(types.string),
// })

// 边数据
// const EdgeModel = types.model('ErdEdgeModel', {
//   type: types.string, // 'endpoint/node',
//   id: types.string,
//   source: types.string,
//   target: types.string,
//   sourceNode: types.string,
//   targetNode: types.string,
//   arrow: types.maybeNull(types.boolean),
//   arrowPosition: types.maybeNull(types.number),
//   arrowOffset: types.maybeNull(types.number),
//   label: types.maybeNull(types.string),
// })

// // 节点数据
// const NodeModel = types.model('ErdNodeModel', {
//   id: types.string,
//   top: types.maybeNull(types.number),
//   left: types.maybeNull(types.number),
//   draggable: types.maybeNull(types.boolean),
//   group: types.maybeNull(types.string),
//   scope: types.maybeNull(types.string),
// })

export const graphModel = types
  .model('ErdGraphModel', {
    fullScreen: false,
    readMode: false,
    addMode: false,
    linkMode: false,
    clickLink: false,
    // nodes: types.array(NodeModel),
    // edges: types.array(EdgeModel),
  })
  .views((self) => {
    return {
      get canActiveItem() {
        return !self.readMode && !self.addMode && !self.linkMode
      },
      // get nodesData() {
      //   return getNodesData(self.nodes)
      // },
      // get edgesData() {
      //   return getNodesData(self.edges)
      // },
    }
  })
  .volatile(() => {
    return {
      canvas: null as any,
    }
  })
  .actions((self) => {
    const setCanvas = (canvas: any) => {
      self.canvas = canvas
    }

    const disabledCanvas = () => {
      self.canvas.setLinkable(false)
      self.canvas.setDisLinkable(false)
      self.canvas.setDraggable(false)
    }

    const enabledCanvas = () => {
      self.canvas.setLinkable(true)
      self.canvas.setDisLinkable(true)
      self.canvas.setDraggable(true)
    }

    const toggleReadMode = (toggle?: any) => {
      const isReadMode = typeof toggle === 'boolean' ? toggle : !self.readMode

      self.readMode = isReadMode

      if (isReadMode) {
        disabledCanvas()
      } else {
        enabledCanvas()
      }
    }

    const toggleClickLink = (toggle?: any) => {
      const isClickLink = typeof toggle === 'boolean' ? toggle : !self.clickLink
      self.clickLink = isClickLink
    }

    const toggleAddMode = (toggle?: any) => {
      const isAddable = typeof toggle === 'boolean' ? toggle : !self.addMode
      self.addMode = isAddable
    }

    const toggleLinkMode = (toggle?: any) => {
      const isLinkable = typeof toggle === 'boolean' ? toggle : !self.linkMode
      self.linkMode = isLinkable
    }

    const toggleFullScreen = (toggle?: any) => {
      const isFullScreen = typeof toggle === 'boolean' ? toggle : !self.fullScreen
      self.fullScreen = isFullScreen
    }

    return {
      setCanvas,
      toggleReadMode,
      toggleAddMode,
      toggleClickLink,
      toggleFullScreen,
      toggleLinkMode,
    }
  })

export const graphStore = graphModel.create({})
