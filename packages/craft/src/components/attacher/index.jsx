import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  .attach {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
  }
  .hlbox {
    position: absolute;
    border: 1px solid #4285f4;
    background: rgba(66, 133, 244, 0.05);
  }
  .tip,
  .toolbar {
    position: absolute;
    height: 25px;
    padding: 0 5px;
    border: 1px solid #4285f4;
    border-bottom: 0;
    text-align: center;
    background: rgba(66, 133, 244, 0.05);
  }

  .hover {
    border-style: dashed;
    background: transparent;
    .tip {
      border-style: dashed;
      background: transparent;
    }
  }
  .tip {
    top: -25px;
    left: -1px;
    min-width: 50px;
  }
  .toolbar {
    position: absolute;

    button {
      background: transparent;
      border: 0;
      color: #666;
    }
  }
`

// nodes 节点池
const nodes = {
  'page-1': {
    type: 'page',
  },
  'card-3': {
    type: 'card',
  },
  'button-1': {
    type: 'button',
  },
}

const displayNone = { display: 'none' }

export default () => {
  const [hover, setHover] = useState({ style: displayNone })
  const [selected, setSelected] = useState({
    style: displayNone,
    toolbarStyle: displayNone,
  })
  const $wrap = useRef(null)

  const hoverInfo = nodes[hover.id] || {}
  const selectedInfo = nodes[selected.id] || {}

  const removeHover = () => {
    setHover({ style: displayNone })
  }

  const onActive = (type, event, parentRect) => {
    const $this = $(event.target)
    const $ele = $this.closest('[data-id]')
    const activeId = $ele.data('id')

    // 没有 data-id 标记的内容，不处理
    if (!$ele.length) {
      return
    }

    // 已经选择对象的不能被hover,或者再次选择
    if ($wrap.current?.dataset.selected === activeId) {
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
      setHover({ id: activeId, style })
      return
    }

    if (type === 'selected') {
      const toolbarStyle = {
        display: 'block',
        right: parentRect.right - right,
        top: top - parentRect.top - 25,
      }
      const tipStyle = { display: width >= 100 ? 'display' : 'none' }

      removeHover()
      setSelected({ id: activeId, style, toolbarStyle, tipStyle })

      
    }
  }

  useEffect(() => {
    const $preview = $('#editor-preview')
    const parentRect = $preview[0].getBoundingClientRect()

    $preview
      .on('mouseleave', removeHover)
      .on(
        'click',
        debounce((e) => onActive('selected', e, parentRect), 200)
      )
      .on(
        'mouseover',
        debounce((e) => onActive('hover', e, parentRect), 200)
      )

    return () => {
      $('#app-root').off()
    }
  }, [])

  return (
    <Wrap ref={$wrap} data-selected={selected.id}>
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
    </Wrap>
  )
}
