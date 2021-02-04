import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
// import Sortable from 'sortablejs'

import RightOutlined from '@ant-design/icons/RightOutlined'
import { useImmer } from '@core/utils/hooks'

// import { mockTableData } from './mock'

import { useStore } from '../../store'
import * as S from './styled'

// TODO 添加 排序功能---需要二次确认功能

const NavField = observer((props: any) => {
  const { label, id } = props.data
  const { setActiveFieldId, activeFieldId } = useStore()

  const isActive = activeFieldId === id

  const onFieldClick = () => {
    if (!isActive) {
      setActiveFieldId(id)
    }
  }

  return (
    <S.NavField className={`${isActive ? 'active' : ''}`} onClick={onFieldClick}>
      <div className="field-label">
        <ul className="field-icons">
          <li>/</li>
          <li>k</li>
        </ul>
        <span>{label}</span>
      </div>
      <ul className="field-tool">
        <li>+</li>
        <li>c</li>
        <li>x</li>
      </ul>
    </S.NavField>
  )
})

const NavNode = (props: any) => {
  const { data, isExpand, setExpandId } = props
  const { label, fields = [], id } = data

  const $contentRef = useRef()

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
          <span>{label}</span>
        </div>
        <ul className="node-tool">
          <li>o</li>
          <li>+</li>
          <li>x</li>
        </ul>
      </div>
      <div ref={$contentRef} className="node-content">
        {fields.map((item) => {
          return <NavField key={item.id} data={item} />
        })}
      </div>
    </S.NavNode>
  )
}

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
        return <NavNode key={table.id} data={table} isExpand={isExpand} setExpandId={setExpandId} />
      })}
    </S.NavTreeWrap>
  )
})

export default NavTree
