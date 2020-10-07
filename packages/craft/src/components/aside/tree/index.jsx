/**
 * 预览时的节点导航
 *
 * TODO: 重写 tree 组件
 */

import React, { useState } from 'react'
import { observer } from 'mobx-react'
import cls from 'classnames'
import { Collapse } from 'amis'
import { uuid } from 'amis/lib/utils/helper'
import { throttle } from 'lodash'

import { message } from '@/constants'
import { useSubscriber } from '@core/utils/hooks'
import { previewStore } from '@/components/preview/store'

import { useAsideStore } from '../store'

import { StyledTree } from './styled'

const hasNodeId = (id) => id && id.indexOf('none') === -1
const treeSponsor = 'asideTree'

export default observer((props) => {
  const { classPrefix: ns, classnames: cx } = props

  const { nodes = [] } = useAsideStore()
  const [hoverId, setHoverId] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [foldId, setFoldId] = useState('')

  const toggleFold = (id) => {
    setFoldId((v) => (v === id ? '' : id))
  }

  const onSelect = (id) => {
    if (hasNodeId(id)) {
      setSelectedId(id)
      previewStore.setSelectedId(id, treeSponsor)
    }
  }

  const onHover = throttle((id) => {
    setHoverId('')
    previewStore.setHoverId(hasNodeId(id) ? id : '', treeSponsor)
  }, 10)

  const onLeave = () => {
    setHoverId('')
    previewStore.setHoverId('', treeSponsor)
  }

  const getItemCls = (id, classStr = '') => {
    const hasId = hasNodeId(id)
    const isSelected = hasId && selectedId === id
    const isHover = hasId && hoverId === id
    return cls(classStr, {
      'node-hover': isHover,
      'node-selected': isSelected,
      'node-normal': hasId && !isHover && !isSelected,
    })
  }

  useSubscriber([message.updateHover, message.updateSelected], (data, key) => {
    const { id, sponsor } = data
    if (sponsor === treeSponsor) {
      return
    }
    if (key === message.updateHover) {
      setHoverId(id)
    } else {
      setSelectedId(id)
    }
  })

  const renderItem = (item) => {
    const { id, label, type } = item
    return (
      <span onMouseEnter={() => onHover(id)} onClick={() => onSelect(id)}>
        {type}
      </span>
    )
  }

  const renderSubTree = (items, deep = 0) => {
    return (
      <ul className={cls({ 'tree-root': deep === 0 })}>
        {items.map((item, index) => {
          const { id } = item

          if (!item.children || !item.children.length) {
            return (
              <li key={index} className={getItemCls(id, 'tree-leaf')}>
                {renderItem(item)}
              </li>
            )
          }

          return (
            <li key={index}>
              <div className="tree-label" className={getItemCls(id)}>
                <span
                  className={cls(`icon-arrow ${ns}Collapse-arrow`, {
                    'is-fold': foldId === id,
                  })}
                  onClick={() => toggleFold(id)}
                ></span>
                {renderItem(item)}
              </div>
              <Collapse show={foldId !== id} classnames={cx} classPrefix={ns}>
                {renderSubTree(item.children, deep + 1)}
              </Collapse>
            </li>
          )
        })}
      </ul>
    )
  }

  return <StyledTree onMouseLeave={onLeave}>{renderSubTree(nodes)}</StyledTree>
})
