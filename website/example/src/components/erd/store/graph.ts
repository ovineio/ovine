import { types } from 'mobx-state-tree'

import { rmActiveEndpoint } from '../components/graph/canvas'

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
    // nodes: types.array(NodeModel),
    // edges: types.array(EdgeModel),
  })
  // .views((self) => {
  //   return {
  //     get canActiveItem() {
  //       return !self.readMode && !self.addMode && !self.linkMode && !self.sortToggle
  //     },
  //     // get nodesData() {
  //     //   return getNodesData(self.nodes)
  //     // },
  //     // get edgesData() {
  //     //   return getNodesData(self.edges)
  //     // },
  //   }
  // })
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
    }

    const enabledCanvas = () => {
      self.canvas.setLinkable(true)
      self.canvas.setDisLinkable(true)
    }

    const toggleReadMode = (toggle?: any) => {
      const isReadMode = typeof toggle === 'boolean' ? toggle : !self.readMode

      self.readMode = isReadMode
      rmActiveEndpoint()
      if (isReadMode) {
        disabledCanvas()
      } else {
        enabledCanvas()
      }
    }

    const toggleAddMode = (toggle?: any) => {
      rmActiveEndpoint()
      const isAddable = typeof toggle === 'boolean' ? toggle : !self.addMode
      self.addMode = isAddable
    }

    const toggleFullScreen = (toggle?: any) => {
      const isFullScreen = typeof toggle === 'boolean' ? toggle : !self.fullScreen
      self.fullScreen = isFullScreen
    }

    return {
      setCanvas,
      toggleReadMode,
      toggleAddMode,
      toggleFullScreen,
    }
  })

export const graphStore = graphModel.create({})
