import _ from 'lodash'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import checkRender from '../util/check-render.js'
import BfNode from './node'

const deepWalk = function deepWalk(element) {
  const childElements = []

  const walk = function walk(ele) {
    let PreElement = ele
    const children = _.get(PreElement, 'props.children')

    if (!PreElement) {
      return
    }

    // FIXME: is there a better way？
    if (typeof PreElement.type === 'function' && !PreElement.props.children) {
      try {
        // eslint-disable-next-line
        PreElement = new PreElement.type(PreElement.props)
        walk(PreElement.render())
      } catch (e) {
        e
      }

      return
    }

    if (!children) {
      return
    }

    if (Array.isArray(children)) {
      children.forEach(function(child) {
        childElements.push(child)
        walk(child)
      })
    }

    childElements.push(children)
    walk(children)
  }

  walk(element)
  return childElements
}

const noop = () => null

const NodeRender = (props) => {
  const { nodes, idPrefix, canvas, onRenderFinish = noop } = props
  const endpoints = []

  // ============== Set React Endpoint To Canvas ==============
  useEffect(() => {
    if (!canvas || !_.isArray(nodes)) {
      return
    }

    // 如果用户已经使用endpoints代替自定义node
    // 此时不需要渲染React Endpoint
    const isUserCfgEndpoint = () => {
      // nodeId
      return true
      // const userDefNode = nodes.find((n) => n.id === nodeId)
      // return !!userDefNode?.endpoints
    }

    // 添加节点
    endpoints.forEach((endpoint) => {
      const { nodeId, endpointId } = endpoint

      if (isUserCfgEndpoint(nodeId)) {
        return
      }

      if (!canvas || !nodeId) {
        return
      }

      const node = canvas.getNode(nodeId)

      if (!node) {
        return
      }

      // debug(`add endpoint ${endpointId} to ${node.id} successfully`)

      if (node.endpoints.some((ep) => ep.id === endpointId)) {
        return
      }

      node.addEndpoint({
        id: endpointId,
        dom: document.getElementById(endpointId),
        ...endpoint,
      })
    })

    // 移除多余锚点
    canvas.nodes.forEach((node) => {
      const nodeId = node.id
      if (isUserCfgEndpoint(nodeId)) {
        return
      }

      const nodeEndpoints = endpoints.filter((endpoint) => {
        return endpoint.nodeId === nodeId
      })

      node.endpoints.forEach((endpoint) => {
        const nodeEndpointIds = nodeEndpoints.map((e) => e.endpointId)
        if (!nodeEndpointIds.includes(endpoint.id)) {
          // debug(`remove endpoint ${endpoint.id} from ${node.id} successfully`)
          node.removeEndpoint(endpoint.id)
        }
      })
    })

    // 存量的锚点需要重新获取 dom，因为dom被移除，可能导致锚点失效
    canvas.nodes.forEach((node) => {
      // if (isUserCfgEndpoint(node.id)) {
      //   return
      // }

      node.endpoints.forEach((endpoint) => {
        const dom = document.getElementById(endpoint.id)

        if (!dom) {
          node.removeEndpoint(endpoint.id)
        }

        endpoint.dom = dom
      })
    })

    onRenderFinish()
  })

  if (!_.isArray(nodes)) {
    return null
  }

  return nodes.map((item) => {
    const { id } = item

    if (!id) {
      // eslint-disable-next-line
      console.warn(`node ${id} 不含有ID属性，请检查格式`)

      return null
    }

    const dom = document.getElementById(idPrefix + item.id)

    if (!dom) {
      return null
    }

    checkRender(item.render, 'node')
    const { render: itemRender, ...resetData } = item
    const element = itemRender ? itemRender(resetData) : <BfNode key={id} {...resetData} />

    // ============== Gather React Endpoints ==============
    deepWalk(element).forEach((child) => {
      if (typeof child !== 'object') {
        return
      }
      if (child?.type?.name === 'Endpoint') {
        endpoints.push({
          endpointId: child.props.id,
          nodeId: item.id,
        })
      }
    })

    return ReactDOM.createPortal(element, dom)
  })
}

export default NodeRender
