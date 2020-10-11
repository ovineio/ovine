import { includes } from 'lodash'
import { types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'

const Nav = types.model('AsideNav', {
  id: types.string,
  label: types.string,
})

// 权限结构
const Limit = types.model('AsideLimit', {
  id: types.string,
  label: types.string,
  needs: types.maybeNull(types.array(types.string)),
})

// 请求结构 ---- 后期再完善
const Request = types.model('AsideRequest', {
  id: types.string,
  label: types.string,
  method: types.string,
  url: types.string,
  dataType: types.string,
  domain: types.maybeNull(types.string),
  sendOn: types.maybeNull(types.string),
  expired: types.maybeNull(types.number),
  onPreRequest: types.maybeNull(types.string),
  onRequest: types.maybeNull(types.string),
  onSuccess: types.maybeNull(types.string),
  onError: types.maybeNull(types.string),
})

// 节点树 节点结构
const Node = types.model('AsideNode', {
  id: types.string,
  type: types.string,
  children: types.array(types.late(() => Node)),
})

// 侧边栏 tab 分栏
const Tab = types.enumeration('AsideBarTab', ['page', 'requests', 'limits', 'templates'])

const Aside = types
  .model('AsideState', {
    tab: Tab,
    navs: types.optional(types.array(Nav), []),
    requests: types.optional(types.array(Request), []),
    limits: types.optional(types.array(Limit), []),

    nodes: types.optional(types.array(Node), []),

    isShowPanel: types.optional(types.boolean, false),
    isShowNodes: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const setTab = (tab) => {
      self.isShowNodes = false

      if (includes(['requests', 'limits'], tab)) {
        self.isShowNodes = false
      } else {
        self.isShowNodes = true
      }

      self.tab = tab
    }

    const setNodes = (nodes) => {
      self.nodes = nodes
    }

    const setLimits = (limits) => {
      self.limits = limits
    }

    const setRequests = (requests) => {
      self.requests = requests
    }

    const setNavs = (navs) => {
      self.navs = navs
    }

    return {
      setTab,
      setNodes,
      setLimits,
      setRequests,
      setNavs,
    }
  })

export const tabs = {
  page: {
    title: '页面',
    icon: 'fa fa-window-maximize',
  },
  requests: {
    title: '请求',
    icon: 'fa fa-send',
  },
  limits: {
    title: '权限',
    icon: 'fa fa-unlock-alt',
  },
  templates: {
    title: '模版',
    icon: 'fa fa-puzzle-piece',
  },
}

const initState = {
  tab: 'page',
  navs: [
    {
      id: '',
      label: '页面',
    },
  ],
  nodes: [],
  isShowPanel: true,
  isShowNodes: true,
}

export const asideStore = Aside.create(initState)

const AsideContext = createContext(null)

export const AsideProvider = AsideContext.Provider

export const useAsideStore = () => {
  return useContext(AsideContext)
}
