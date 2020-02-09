/**
 * APP 搜索
 */

import React from 'react'

import { asideMenuConfig } from '~/routes/limit'
import { useImmer } from '~/utils/hooks'
import { cls } from '~/utils/tool'

import { Amis } from '../amis/schema'

import { themes } from './common'
import HeadItem from './head_item'
import { SearchInput } from './styled'

type Props = {
  theme: string
}
type State = {
  isInputActive: boolean
  value: string
}
export default (props: Props) => {
  const { theme } = props
  const [state, setState] = useImmer<State>({
    value: '',
    isInputActive: false,
  })

  const { isInputActive, value } = state

  const inputSchema = {
    title: '',
    type: 'form',
    mode: 'normal',
    wrapWithPanel: false,
    autoFocus: true,
    className: 'm-n',
    controls: [
      {
        type: 'tree-select',
        name: 'tree',
        label: '',
        className: cls('m-n', { active: isInputActive }),
        inputClassName: 'search-input',
        searchable: true,
        valueField: 'nodePath',
        placeholder: '搜索侧边栏...',
        // TODO: 选中非 路由节点，自动跳转到 距离最近的 带 path 的路由
        options: asideMenuConfig,
      },
    ],
    actions: [],
  }

  return (
    <>
      <HeadItem
        theme={theme}
        faIcon="search"
        tip="搜索"
        onClick={() => {
          setState((d) => {
            d.isInputActive = !d.isInputActive
          })
        }}
      />
      <SearchInput ns={themes[theme].ns}>
        <Amis schema={inputSchema} />
      </SearchInput>
    </>
  )
}
