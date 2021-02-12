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
      <input
        placeholder="搜索模型..."
        disabled={!canActiveItem}
        value={searchText}
        onChange={onInputChange}
      />
      {!!searchText && <CloseCircleFilled onClick={onCancel} />}
    </S.SearchBox>
  )
})

const Aside = observer(() => {
  const { graph, model, aside, activeId, activeFieldId } = useStore()
  const { addMode, readMode, toggleAddMode } = graph
  const { focusActiveKey, withSearch, sortToggle, setSearchText, toggleSortMode } = aside

  const barInsRef = useRef<any>(null)
  const hasNodes = !!model.tables.length
  const canSort = !hasNodes || readMode || addMode
  const canAdd = readMode || sortToggle

  const toggleSort = () => {
    if (canSort) {
      return
    }
    if (!sortToggle) {
      setSearchText('')
    }
    toggleSortMode()
  }

  const toggleAdd = () => {
    if (canAdd) {
      return
    }
    toggleAddMode()
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
    <S.AsideWrap className={cls({ 'sort-mode': sortToggle })}>
      <S.Header className="aside-header">
        <div className="title">
          <AppstoreFilled />
          <span>模型导航</span>
        </div>
        <ul className="erd-hd-toolbar">
          <li onClick={toggleSort}>
            <SwapOutlined className={cls({ active: sortToggle, disabled: canSort })} />
          </li>
          <li onClick={toggleAdd}>
            <PlusOutlined className={cls({ active: addMode, disabled: canAdd })} />
          </li>
        </ul>
      </S.Header>
      <div className="aside-body">
        {hasNodes &&
          (sortToggle ? (
            <div className="sort-ctl">
              <span>请拖动排序</span>
              <button type="button" onClick={toggleSort}>
                取消
              </button>
              <button type="button" onClick={() => toggleSortMode(1)}>
                保存
              </button>
            </div>
          ) : (
            <SearchBox />
          ))}
        <ScrollBar instanceRef={barInsRef} className="aside-nav">
          <NavTree />
        </ScrollBar>
      </div>
    </S.AsideWrap>
  )
})

export default Aside
