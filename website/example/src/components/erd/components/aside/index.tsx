import React from 'react'

import AppstoreFilled from '@ant-design/icons/AppstoreFilled'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

import ScrollBar from '~/components/scroll_bar'

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

const Aside = () => {
  return (
    <S.AsideWrap>
      <S.Header>
        <div className="title">
          <AppstoreFilled />
          <span>模型导航</span>
        </div>
        <ul className="erd-hd-toolbar">
          <li>
            <PlusOutlined />
          </li>
        </ul>
      </S.Header>
      <SearchBox />
      <ScrollBar className="aside-body">
        <NavTree />
      </ScrollBar>
    </S.AsideWrap>
  )
}

export default Aside
