/**
 * TODO: 添加搜索 功能
 */

import cls from 'classnames'
import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'

import AppstoreFilled from '@ant-design/icons/AppstoreFilled'
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import SwapOutlined from '@ant-design/icons/SwapOutlined'

import ScrollBar from '~/components/scroll_bar'

import { useStore } from '../../store'
import NavTree from '../nav_tree'

import * as S from './styled'

const SearchBox = observer(() => {
  const { aside, canActiveItem } = useStore()
  const { searchText, setSearchText } = aside

  // TODO: 添加 节流 函数 防止组建更新多
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setSearchText(text)
  }

  const onCancel = () => {
    setSearchText('')
  }

  return (
    <S.SearchBox className={cls({ disabled: !canActiveItem })}>
      <SearchOutlined />
      <input placeholder="搜索模型..." value={searchText} onChange={onInputChange} />
      {!!searchText && <CloseCircleFilled onClick={onCancel} />}
    </S.SearchBox>
  )
})

const Aside = observer(() => {
  const { graph, model, aside, canActiveItem, activeId, activeFieldId } = useStore()
  const { addMode, toggleAddMode } = graph
  const { focusActiveKey, withSearch, sortMode, toggleSortMode } = aside

  const barInsRef = useRef<any>(null)

  // const barOpts = {
  //   onUpdated: () => {},
  // }

  const toggleSort = () => {
    toggleSortMode()
  }

  // 定位到指定节点, 修复点击导航 停顿问题
  useEffect(
    debounce(() => {
      if (!withSearch && focusActiveKey) {
        const id = activeFieldId || activeId
        const instance = barInsRef.current
        instance.scroll(
          $(instance.getElements().host)
            .find(`div[data-id="${id}"]`)
            .get(0),
          200
        )
      }
    }, 400),
    [focusActiveKey]
  )

  return (
    <S.AsideWrap>
      <S.Header>
        <div className="title">
          <AppstoreFilled />
          <span>模型导航</span>
        </div>
        <ul className="erd-hd-toolbar">
          <li onClick={toggleSort}>
            <SwapOutlined
              className={cls({ active: sortMode, disabled: !canActiveItem && !sortMode })}
            />
          </li>
          <li onClick={toggleAddMode}>
            <PlusOutlined className={cls({ active: addMode, disabled: !canActiveItem })} />
          </li>
        </ul>
      </S.Header>
      {!!model.tables.length && <SearchBox />}
      <ScrollBar instanceRef={barInsRef} className="aside-body">
        <NavTree />
      </ScrollBar>
    </S.AsideWrap>
  )
})

export default Aside
