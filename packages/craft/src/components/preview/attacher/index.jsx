/**
 * 悬浮/或者选中 选中时的高亮
 *
 * TODO:
 * 1. 完善toolbar 快捷操作
 * 2. 针对不同类型不同toolbar操作
 * 3. UI美化
 *
 * BUG:
 * 1. 监听 选中 dom 宽高变化，更新 高亮 UI
 * 2. 某些类型 --- 选中时禁用点击
 * 3. 布局要跟随 preview
 */

import { debounce, includes, throttle } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { domId } from '@/constants'
import { referenceStore } from '@/components/reference/store'

import { usePreviewStore } from '../store'
import { onNodeMenus } from '../actions'

import { StyledAttacher } from './styled'

const displayNone = { display: 'none' }

export default observer(() => {
  const {
    setHoverId,
    setSelectedId,
    hoverId,
    selectedId,
    hoverInfo,
    selectedInfo,
    renderSchema,
  } = usePreviewStore()

  const [hover, setHover] = useState({ style: displayNone })
  const [selected, setSelected] = useState({
    style: displayNone,
    tipStyle: displayNone,
    toolbarStyle: displayNone,
  })
  const $wrap = useRef(null)

  const cancelHover = () => {
    setHover({ style: displayNone })
    setHoverId('')
  }

  const cancelSelected = () => {
    setSelected({ style: displayNone, toolbarStyle: displayNone })
    setSelectedId('')
  }

  const onActive = (type, $ele, parentRect) => {
    // 没有 data-id 标记的内容，不处理
    if (!$ele.length) {
      return
    }

    const activeId = $ele.data('id')

    // 已经选择对象的不能被hover,或者再次选择
    if (type !== 'updateSelected' && $wrap.current?.dataset.selected === activeId) {
      cancelHover()
      return
    }

    // 计算位置
    const { width, height, left, right, top } = $ele[0].getBoundingClientRect()
    const style = {
      display: 'block',
      width,
      height,
      left: left - parentRect.left,
      top: top - parentRect.top,
    }

    if (type === 'hover') {
      setHover({ style })
      return
    }

    if (includes(['selected', 'updateSelected'], type)) {
      const toolbarStyle = {
        display: 'block',
        right: parentRect.right - right,
        top: top - parentRect.top - 25,
      }
      const tipStyle = { display: width >= 100 ? 'block' : 'none' }

      cancelHover()
      setSelected({ style, toolbarStyle, tipStyle })
    }
  }

  const setActiveById = (type, id) => {
    if (!id) {
      return
    }

    const $preview = $(`#${domId.editorPreview}`)
    const parentRect = $preview[0].getBoundingClientRect()
    const $active = $preview.find(`[data-id="${id}"]`)
    onActive(type, $active, parentRect)
  }

  const onMounted = () => {
    const $preview = $(`#${domId.editorPreview}>[data-preview]`)

    const onNodeActive = throttle((type, event) => {
      const $ele = $(event.target).closest('[data-id]')
      const activeId = $ele.data('id')

      if (!activeId) {
        return
      }

      if (type === 'hover') {
        setHoverId(activeId)
        return
      }

      if (type === 'selected') {
        const isSelected = $wrap.current?.dataset.selected === activeId

        // 左键 点击选择
        if (event.button === 0) {
          setSelectedId(activeId)
        }

        if (event.button === 2) {
          // 已经选中 并且是鼠标右键
          if (isSelected && event.button === 2) {
            onNodeMenus({
              position: {
                x: event.pageX,
                y: event.pageY,
              },
            })
          }
        }
      }
    }, 100)

    $(window).on('resize', updateSelected) // 当窗口变化时 更新
    $preview.parent().scroll(updateSelected) // 当滚动时 更新

    $preview
      .on('contextmenu', () => false)
      .on('mouseleave', cancelHover)
      .on('mousedown', (e) => onNodeActive('selected', e))
      .on('mouseover', (e) => onNodeActive('hover', e))
      .on('click', (e) => {
        // button 类型的点击一律过滤
        if ($(e.target).closest('button')) {
          e.stopPropagation()
        }
      })

    return () => {
      $preview.off()
    }
  }

  const updateSelected = debounce(() => {
    if (hoverId) {
      cancelHover()
    }

    setActiveById('updateSelected', $wrap.current?.dataset.selected)
  }, 100)

  const onSelected = throttle(() => {
    // 取消选中
    if (!selectedId) {
      referenceStore.setSchema({})
      cancelSelected()
      return
    }

    // selectedId 改变， 高亮与关联面板 同时更新
    referenceStore.setSchema(selectedInfo.schema)
    updateSelected()
  }, 100)

  const onHover = throttle(() => {
    if (hoverId) {
      setActiveById('hover', hoverId)
    } else {
      cancelHover()
    }
  }, 100)

  useEffect(onMounted, [])
  useEffect(onSelected, [selectedId])
  useEffect(onHover, [hoverId])
  useEffect(updateSelected, [renderSchema])

  return (
    <StyledAttacher ref={$wrap} data-selected={selectedId}>
      <div className="attach">
        <div className="hlbox selected" style={selected.style}></div>
        <div className="hlbox hover" style={hover.style}></div>
      </div>
    </StyledAttacher>
  )
})
