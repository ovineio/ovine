import { createContext, useContext } from 'react'
import { types } from 'mobx-state-tree'

import { includes } from 'lodash'

const Action = types.model('AsideAction', {})
const Dialog = types.model('AsideDialog', {})
const Request = types.model('AsideRequest', {})
const Form = types.model('AsideForm', {})
const Node = types.model('AsideNode', {})

export const tabs = {
  page: {
    title: '页面',
  },
  actions: {
    title: '操作',
  },
  dialogs: {
    title: '弹窗',
  },
  forms: {
    title: '表单',
  },
  requests: {
    title: '请求',
  },
  limits: {
    title: '权限',
  },
  templates: {
    title: '模版',
  },
}

const Aside = types
  .model('AsideState', {
    tab: types.enumeration('AsideBarTab', [
      'page',
      'actions',
      'dialogs',
      'forms',
      'requests',
      'limits',
      'templates',
    ]),
    actions: types.maybeNull(types.map(Action)),
    dialogs: types.maybeNull(types.map(Dialog)),
    requests: types.maybeNull(types.map(Request)),
    forms: types.maybeNull(types.map(Form)),
    nodes: types.maybeNull(types.map(Node)),

    isShowPanel: types.maybeNull(types.boolean),
    isShowNodes: types.maybeNull(types.boolean),
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

    return {
      setTab,
    }
  })

export const asideStore = Aside.create({
  tab: 'page',
  isShowPanel: true,
  isShowNodes: true,
})

const AsideContext = createContext(null)

export const AsideProvider = AsideContext.Provider

export const useAsideStore = () => {
  return useContext(AsideContext)
}
