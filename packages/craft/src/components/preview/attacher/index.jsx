import { debounce, includes } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { domIds } from '@/constants'
import { referenceStore } from '@/components/reference/store'

import { usePreviewStore } from '../store'

import { StyledAttacher } from './styled'

const displayNone = { display: 'none' }

export default () => {
  const {
    setHoverId,
    setSelectedId,
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

  const removeHover = () => {
    setHover({ style: displayNone })
    setHoverId('')
  }

  const onActive = (type, $ele, parentRect) => {
    // 没有 data-id 标记的内容，不处理
    if (!$ele.length) {
      return
    }

    const activeId = $ele.data('id')

    // 已经选择对象的不能被hover,或者再次选择
    if (type !== 'updateSelected' && $wrap.current?.dataset.selected === activeId) {
      removeHover()
      return
    }

    const { width, height, left, right, top } = $ele[0].getBoundingClientRect()
    const style = {
      display: 'block',
      width,
      height,
      left: left - parentRect.left,
      top: top - parentRect.top,
    }

    if (type === 'hover') {
      setHoverId(activeId)
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

      removeHover()
      setSelectedId(activeId)
      setSelected({ style, toolbarStyle, tipStyle })
    }
  }

  useEffect(() => {
    const $preview = $(`#${domIds.editorPreview}`)
    const parentRect = $preview[0].getBoundingClientRect()

    $preview
      .on('mouseleave', removeHover)
      .on(
        'click',
        debounce((e) => {
          const $ele = $(e.target).closest('[data-id]')
          onActive('selected', $ele, parentRect)
        }, 200)
      )
      .on(
        'mouseover',
        debounce((e) => {
          const $ele = $(e.target).closest('[data-id]')
          onActive('hover', $ele, parentRect)
        }, 200)
      )

    return () => {
      $preview.off()
    }
  }, [])

  useEffect(() => {
    referenceStore.setSchema(selectedInfo.schema)
  }, [selectedInfo.schema])

  useEffect(() => {
    if (!$wrap.current) {
      return
    }

    const { selected } = $wrap.current.dataset
    if (!selected) {
      return
    }

    const $preview = $(`#${domIds.editorPreview}`)
    const parentRect = $preview[0].getBoundingClientRect()
    const $selected = $preview.find(`[data-id="${selected}"]`)

    setTimeout(() => {
      onActive('updateSelected', $selected, parentRect)
    }, 100)
  }, [renderSchema])

  return (
    <StyledAttacher ref={$wrap} data-selected={selectedId}>
      <div className="toolbar" style={selected.toolbarStyle}>
        <button type="button" data-tooltip="可拖拽修改位置" data-position="bottom">
          <i className="fa fa-arrows" />
        </button>
        <button type="button" data-tooltip="删除（Del）" data-position="bottom">
          <i className="fa fa-trash-o" />
        </button>
        <button type="button" draggable="false" data-id="more" data-position="bottom">
          <i className="fa fa-ellipsis-h" />
        </button>
      </div>
      <div className="attach">
        <div className="hlbox selected" style={selected.style}>
          <div className="tip" style={selected.tipStyle}>
            {selectedInfo.type}
          </div>
        </div>
        <div className="hlbox hover" style={hover.style}>
          <div className="tip">{hoverInfo.type}</div>
        </div>
      </div>
    </StyledAttacher>
  )
}
