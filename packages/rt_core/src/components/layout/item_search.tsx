/**
 * APP 搜索
 */

import { findTree } from 'amis/lib/utils/helper'
import React from 'react'
import { useHistory } from 'react-router-dom'

import { getAsideMenus } from '~/routes/limit'
import { useImmer } from '~/utils/hooks'
import { cls } from '~/utils/tool'

import { Amis } from '../amis/schema'

import HeadItem from './head_item'
import { SearchInput } from './styled'

type State = {
  isInputActive: boolean
  value: string
}
export default () => {
  const [state, setState] = useImmer<State>({
    value: '',
    isInputActive: false,
  })
  const history = useHistory()

  const { isInputActive } = state

  const asideMenus = getAsideMenus()

  const inputSchema = {
    title: '',
    type: 'form',
    mode: 'normal',
    wrapWithPanel: false,
    autoFocus: true,
    className: 'm-n',
    actions: [],
    controls: [
      {
        type: 'tree-select',
        name: 'nodePath',
        label: '',
        className: cls('m-n', { active: isInputActive }),
        inputClassName: 'search-input',
        searchable: true,
        valueField: 'nodePath',
        placeholder: '搜索侧边栏...',
        options: asideMenus,
      },
    ],
    onChange: (formValue: any) => {
      const { nodePath } = formValue
      const nodeItem = findTree(asideMenus, (item) => nodePath === item.nodePath)
      if (!nodeItem) {
        return
      }
      // 直接跳转指定页面
      if (nodeItem.path) {
        history.push(nodeItem.path)
        //
      } else if (nodeItem.children) {
        // 查找第一个 具有path 的节点，并跳转
        const pathItem = findTree(nodeItem.children, (item) => !!item.path)
        if (pathItem?.path) {
          history.push(pathItem.path)
        }
      }
    },
  }

  return (
    <>
      <HeadItem
        faIcon="search"
        tip="搜索"
        onClick={() => {
          setState((d) => {
            d.isInputActive = !d.isInputActive
          })
        }}
      />
      <SearchInput>
        <Amis schema={inputSchema} />
      </SearchInput>
    </>
  )
}
