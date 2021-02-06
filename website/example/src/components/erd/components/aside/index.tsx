import cls from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import AppstoreFilled from '@ant-design/icons/AppstoreFilled'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

import ScrollBar from '~/components/scroll_bar'

import { useStore } from '../../store'
import NavTree from '../nav_tree'

import * as S from './styled'

const SearchBox = () => {
  return (
    <S.SearchBox>
      <SearchOutlined />
      <input placeholder="搜索模型..." />
    </S.SearchBox>
  )
}

const Aside = observer(() => {
  const { graph } = useStore()
  const { addMode, readMode, clickLink, toggleAddMode } = graph

  return (
    <S.AsideWrap>
      <S.Header>
        <div className="title">
          <AppstoreFilled />
          <span>模型导航</span>
        </div>
        <ul className="erd-hd-toolbar">
          <li onClick={toggleAddMode}>
            <PlusOutlined className={cls({ active: addMode, disabled: clickLink || readMode })} />
          </li>
        </ul>
      </S.Header>
      <SearchBox />
      <ScrollBar className="aside-body">
        <NavTree />
      </ScrollBar>
    </S.AsideWrap>
  )
})

export default Aside
