import React from 'react'

import RightOutlined from '@ant-design/icons/RightOutlined'
import { useImmer } from '@core/utils/hooks'

import { mockTableData } from './mock'

import * as S from './styled'

const NavField = (props: any) => {
  const { label } = props.data

  return <S.NavField>{label}</S.NavField>
}

const NavNode = (props: any) => {
  const { data, isExpand, setExpandId } = props
  const { label, items = [], id } = data

  const onHeaderClick = () => {
    setExpandId(isExpand ? '' : id)
  }

  return (
    <S.NavNode className={isExpand ? 'expand' : ''}>
      <div className="node-header" onClick={onHeaderClick}>
        <div className="header-label">
          <RightOutlined />
          <span>{label}</span>
        </div>
      </div>
      <div className="node-content">
        {items.map((item) => {
          return <NavField key={item.id} data={item} />
        })}
      </div>
    </S.NavNode>
  )
}

const NavTree = () => {
  const [state, setState] = useImmer<any>({
    expandId: '',
  })

  const { expandId } = state

  const setExpandId = (id = '') => {
    setState((d) => {
      d.expandId = id
    })
  }

  return (
    <S.NavTreeWrap>
      {mockTableData.map((table) => {
        const isExpand = table.id === expandId
        return <NavNode key={table.id} data={table} isExpand={isExpand} setExpandId={setExpandId} />
      })}
    </S.NavTreeWrap>
  )
}

export default NavTree
