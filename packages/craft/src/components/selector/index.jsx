/**
 * 组件选择器
 * TODO:
 * 1. 修复 当无滚动区域时，每次都nav自动跳到最后一个问题。（这是bootstrap问题，完全理解不了为什么，要选到最后一项）
 *    正确逻辑是：默认不做任何操作
 *    https://github.com/twbs/bootstrap/blob/main/js/src/scrollspy.js#L209
 * 2. 完成 选择后 将 组件添加到对应位置
 */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Drawer } from 'amis'
import { mapTree, flattenTree, filterTree } from 'amis/lib/utils/helper'
import _ from 'lodash'

import { app } from '@core/app'
import { publish } from '@core/utils/message'
import { useImmer, useSubscriber } from '@core/utils/hooks'

import { message, domId } from '@/constants'
import { onAddNode } from '@/components/preview/actions'

import nodeConfig from './nodes'
import { StyledSelector } from './styled'

const Selector = (props) => {
  const { label: headerLabel = '添加组件' } = props.info

  const [state, setState] = useImmer({
    searchText: '',
  })
  const storeRef = useRef({})

  const { searchText } = state

  const items = useMemo(() => {
    // 没有查询时 返回所有数据
    if (!searchText) {
      return flattenTree(nodeConfig)
    }

    const filteredItems = filterTree(nodeConfig, (item) => {
      const { type = '', label = '', parent } = item

      // 父级 默认全部通过匹配，直接判断 子级 的数据
      if (!parent) {
        return true
      }

      // 只判断 type 与 label 两个数据
      return type.indexOf(searchText) > -1 || label.indexOf(searchText) > -1
    })
    return flattenTree(
      // 过滤掉 没有 子级 的数据
      filterTree(filteredItems, (item) => (!item.parent && !!item.children.length) || !!item.parent)
    )
  }, [searchText])

  const onSearchChange = _.throttle((e) => {
    const { value } = e.currentTarget

    setState((d) => {
      d.searchText = value
    })
  }, 100)

  const onItemClick = (item, e) => {
    const $item = $(e.currentTarget)
    $item
      .addClass('active')
      .siblings()
      .removeClass('active')

    onAddNode({
      container: props.info,
      node: item,
      position: {
        x: e.pageX,
        y: e.pageY,
      },
    })
  }

  useEffect(() => {
    // 使用了 bootstrap scrollspy 组件 https://getbootstrap.com/docs/4.5/components/scrollspy
    const $scrollSpy = $(`#${domId.editorSelector} [data-spy="scroll"]`)
    const $scrollNav = $(`#${domId.editorSelectorNav}`)
    storeRef.current.$scrollSpy = $scrollSpy
    $scrollSpy.scrollspy()

    $scrollNav.on('click', '.nav-link', (e) => {
      const $item = $(e.target)
      if ($item.hasClass('active')) {
        return
      }
      $scrollSpy.scrollspy('dispose')
      $item
        .addClass('active')
        .siblings()
        .removeClass('active')

      const $targetItem = $($item.attr('href'))
      $scrollSpy.animate(
        { scrollTop: $scrollSpy.scrollTop() + $targetItem.offset().top - $scrollSpy.offset().top },
        200,
        () => {
          $scrollSpy.scrollspy('refresh')
        }
      )
    })

    return () => {
      $scrollSpy.scrollspy('dispose')
    }
  }, [])

  useEffect(() => {
    const { $scrollSpy } = storeRef.current

    if (!items.length) {
      $scrollSpy.scrollspy('dispose')
    } else {
      $scrollSpy.scrollspy('refresh')
    }
  }, [items.length])

  return (
    <StyledSelector id={domId.editorSelector}>
      <div className="selector-title">
        <p>{headerLabel}</p>
      </div>
      <div className="selector-input">
        <div className="input">
          <input placeholder="搜索可用组件" value={searchText} onChange={onSearchChange} />
          <i className="fa fa-search" />
        </div>
      </div>
      {items.length === 0 && (
        <div className="selector-empty">
          <i className="fa fa-chain-broken" />
          <span>暂未找到对应组件</span>
        </div>
      )}
      <div className="selector-list">
        <div id={domId.editorSelectorNav} className="selector-nav">
          {items.map((item, index) => {
            if (!item.parent) {
              return (
                <div key={index} className="title nav-link" href={`#spy-${item.type}`}>
                  <i className={`fa fa-${item.icon} p-r-xs`} />
                  <span>{item.label}</span>
                </div>
              )
            } else {
              return (
                <div
                  key={index}
                  className="item nav-link"
                  href={`#spy-${item.parent}-${item.type}`}
                >
                  {item.label}
                </div>
              )
            }
          })}
        </div>
        <div
          className="selector-content"
          data-target={`#${domId.editorSelectorNav}`}
          data-spy="scroll"
        >
          {items.map((item, index) => {
            if (!item.parent) {
              return (
                <div key={index} id={`spy-${item.type}`} className="title">
                  {item.label}
                </div>
              )
            } else {
              return (
                <div
                  key={index}
                  id={`spy-${item.parent}-${item.type}`}
                  className="item"
                  onClick={(e) => onItemClick(item, e)}
                >
                  <img src={item.img} />
                  <div>
                    <h6>{item.label}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </StyledSelector>
  )
}

export const toggleSelector = (info = {}) => {
  publish(message.toggleSelector, info)
}

export default () => {
  const [info, setInfo] = useImmer({})

  const { isShow = false, ...resetInfo } = info

  const onHide = () => {
    setInfo((d) => {
      d.isShow = false
    })
  }

  useSubscriber(message.toggleSelector, (info = {}) => {
    setInfo((d) => info)
  })

  return (
    <Drawer theme={app.theme.getName()} size="md" onHide={onHide} show={isShow} position="right">
      <Selector info={resetInfo} />
    </Drawer>
  )
}
