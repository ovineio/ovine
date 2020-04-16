/**
 * APP 搜索
 */

import { findTree } from 'amis/lib/utils/helper'
import React, { useEffect, useRef, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import { getAsideMenus } from '@/routes/limit'
import { useImmer } from '@/utils/hooks'
import { cls } from '@/utils/tool'

import { Amis } from '../amis/schema'

import HeadItem from './head_item'
import { SearchInput } from './styled'

type State = {
  showInput: boolean
}
export default () => {
  const [state, setState] = useImmer<State>({
    showInput: false,
  })

  const asideMenus = getAsideMenus()
  const history = useHistory()
  const $searchRef = useRef<any>(null)

  const { showInput } = state

  const toggleInput = (toggle?: any) => {
    const isShow = typeof toggle === 'boolean' ? toggle : !showInput
    setState((d) => {
      d.showInput = isShow
    })
    if (isShow) {
      setTimeout(() => {
        $($searchRef.current)
          .find('input')
          .click()
      }, 100)
    }
  }

  useEffect(() => {
    $('body').on('click', (e: any) => {
      if (!$searchRef.current || $.contains($searchRef.current, e.target)) {
        return
      }
      // amis overlay 存在异常 在侧边栏 区域/顶部 区域 不会关闭
      const $search = $($searchRef.current)
      const $input = $search.find('input')
      if (!$input.val()) {
        if ($search.find('.is-opened').length) {
          $input.click()
        }
        setState((d) => {
          d.showInput = false
        })
      }
    })
  }, [])

  const inputSchema = useMemo(() => {
    return {
      title: '',
      type: 'form',
      mode: 'normal',
      wrapWithPanel: false,
      className: 'm-n',
      actions: [],
      controls: [
        {
          type: 'tree-select',
          name: 'nodePath',
          label: '',
          className: cls('m-n', { active: showInput }),
          inputClassName: 'inline',
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
          // 首次 跳转 会丢失 值
          toggleInput(false)
          history.push(nodeItem.path)
          // 查找第一个 具有path 的节点，并跳转
        } else if (nodeItem.children) {
          const pathItem = findTree(nodeItem.children, (item) => !!item.path)
          if (pathItem?.path) {
            toggleInput(false)
            history.push(pathItem.path)
          }
        }
      },
    }
  }, [showInput])

  const searchItemProps = {
    faIcon: 'search',
    tip: '搜索',
    onClick: () => !showInput && toggleInput(true),
  }

  return (
    <>
      <HeadItem itemProps={searchItemProps} />
      <SearchInput ref={$searchRef}>
        <Amis schema={inputSchema} />
      </SearchInput>
    </>
  )
}
