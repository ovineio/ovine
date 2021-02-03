import React from 'react'

import AppstoreFilled from '@ant-design/icons/AppstoreFilled'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

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
        <ul className="tool">
          <li>
            <PlusOutlined />
          </li>
        </ul>
      </S.Header>
      <SearchBox />
      <NavTree />
    </S.AsideWrap>
  )
}

export default Aside
