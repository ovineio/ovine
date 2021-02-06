import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
// import Sortable from 'sortablejs'

import RightOutlined from '@ant-design/icons/RightOutlined'
import { useImmer } from '@core/utils/hooks'

// import { mockTableData } from './mock'

import { useStore } from '../../store'

import { NoFields } from '../state/null_data'
import * as S from './styled'
import { FieldTool, TableTool } from './tool'

// TODO 添加 排序功能---需要二次确认功能
const NavField = observer((props: any) => {
  const { name, id } = props.data
  const { setActiveFieldId, activeFieldId } = useStore()

  const isActive = activeFieldId === id

  const onFieldClick = () => {
    setActiveFieldId(isActive ? '' : id)
  }

  return (
    <S.NavField className={`${isActive ? 'active' : ''}`} onClick={onFieldClick}>
      <div className="field-label">
        <span>{name}</span>
      </div>
      {isActive && <FieldTool id={id} />}
    </S.NavField>
  )
})

//
const NavNode = observer((props: any) => {
  const { data, activeId, isExpand, setExpandId } = props
  const { name, fields = [], id } = data

  const $contentRef = useRef()

  const isActive = activeId === id

  useEffect(() => {
    // const sortable = Sortable.create($contentRef.current, {
    //   group: `node-${id}`,
    //   animation: 150,
    //   fallbackOnBody: true,
    //   swapThreshold: 0.65,
    // })
  }, [])

  const onHeaderClick = () => {
    setExpandId(isExpand ? '' : id)
  }

  return (
    <S.NavNode className={isExpand ? 'expand' : ''}>
      <div className="node-header" onClick={onHeaderClick}>
        <div className="node-label">
          <RightOutlined />
          <span>{name}</span>
        </div>
        {isActive && <TableTool id={id} />}
      </div>
      <div ref={$contentRef} className="node-content">
        {fields.length ? (
          fields.map((item) => {
            return <NavField key={item.id} data={item} />
          })
        ) : (
          <NoFields />
        )}
      </div>
    </S.NavNode>
  )
})

//
const NavTree = observer(() => {
  const { activeId, setActiveId, model } = useStore()
  const $wrapRef = useRef()

  const [state, setState] = useImmer<any>({
    expandId: '',
  })

  const { expandId } = state

  const setExpandId = (id = '') => {
    setState((d) => {
      if (id !== d.expandId) {
        d.expandId = id
      }
    })
  }

  useEffect(() => {
    // const sortable = Sortable.create($wrapRef.current, {
    //   group: 'navList',
    //   direction: 'vertical',
    //   handle: '.node-header',
    // })
  }, [])

  // 设置高亮
  useEffect(() => {
    if (expandId) {
      setActiveId(expandId)
    }
  }, [expandId])

  // 设置展开
  useEffect(() => {
    setExpandId(activeId)
  }, [activeId])

  return (
    <S.NavTreeWrap ref={$wrapRef}>
      {model.tables.map((table) => {
        const isExpand = table.id === expandId
        return (
          <NavNode
            key={table.id}
            data={table}
            activeId={activeId}
            isExpand={isExpand}
            setExpandId={setExpandId}
          />
        )
      })}
    </S.NavTreeWrap>
  )
})

export default NavTree
