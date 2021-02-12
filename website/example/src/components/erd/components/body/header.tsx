import cls from 'classnames'
import { throttle } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import BorderInnerOutlined from '@ant-design/icons/BorderInnerOutlined'
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CompressOutlined from '@ant-design/icons/CompressOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import FullscreenExitOutlined from '@ant-design/icons/FullscreenExitOutlined'
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined'
import HighlightOutlined from '@ant-design/icons/HighlightOutlined'
import OneToOneOutlined from '@ant-design/icons/OneToOneOutlined'
import RedoOutlined from '@ant-design/icons/RedoOutlined'
import SendOutlined from '@ant-design/icons/SendOutlined'
import UndoOutlined from '@ant-design/icons/UndoOutlined'
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined'
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined'

import { useCanvas } from '../../hooks'
import { useStore } from '../../store'

import * as S from './styled'

const Tool = () => {
  const [scale, setScale] = useState(0)
  const $container = document.querySelector('.butterfly-react-container')

  const minScale = 0.2
  const maxScale = 1.5
  const canZoomIn = scale < maxScale
  const canZoomOut = scale > minScale

  const canvas = useCanvas((cvs) => {
    setScale(cvs.getZoom())
  })

  useEffect(() => {
    if (scale) {
      canvas.zoom(scale)
    }
  }, [scale])

  const zoomIn = throttle(() => {
    if (canZoomIn) {
      setScale(scale + 0.1)
    }
  }, 150)

  const zoomOut = throttle(() => {
    if (canZoomOut) {
      setScale(scale - 0.1)
    }
  }, 150)

  const zoomNormal = () => {
    setScale(1)
  }

  const zoomFit = () => {
    canvas.focusCenterWithAnimate(undefined, () => {
      setScale(canvas.getZoom())
    })
  }

  if (!$container) {
    return null
  }

  return createPortal(
    <S.ToolWrap>
      <ul>
        <li onClick={zoomFit}>
          <CompressOutlined />
        </li>
        <li onClick={zoomNormal}>
          <OneToOneOutlined />
        </li>
        <li className={cls({ disabled: canZoomIn })} onClick={zoomIn}>
          <ZoomInOutlined />
        </li>
        <li className={cls({ disabled: canZoomOut })} onClick={zoomOut}>
          <ZoomOutOutlined />
        </li>
      </ul>
    </S.ToolWrap>,
    $container
  )
}

const Header = observer(() => {
  const { graph, activeFieldId, activeId, clearActive, aside } = useStore()
  const { canvas, readMode, fullScreen, toggleReadMode, toggleFullScreen } = graph

  const isSelectedState = activeFieldId || activeId
  const isEditable = !aside.sortToggle && !aside.withSearch && !graph.addMode

  const cancelSelected = () => {
    if (isSelectedState) {
      clearActive()
    }
  }

  const toggleRead = () => {
    if (isEditable) {
      toggleReadMode()
    }
  }

  const undo = () => {
    canvas.undo()
  }

  const redo = () => {
    canvas.redo()
  }

  return (
    <S.HeaderWrap>
      <ul className="erd-hd-toolbar">
        <li onClick={undo}>
          <RedoOutlined />
        </li>
        <li onClick={redo}>
          <UndoOutlined />
        </li>
        <li onClick={toggleRead}>
          {readMode ? (
            <EyeOutlined className="active" />
          ) : (
            <HighlightOutlined className={isEditable ? 'active' : 'disabled'} />
          )}
        </li>
        <li onClick={toggleFullScreen}>
          {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </li>
        <li onClick={cancelSelected}>
          <BorderInnerOutlined className={isSelectedState ? 'active' : 'disabled'} />
        </li>
      </ul>
      <ul className="erd-hd-toolbar">
        <li className="tool-btn">
          <CheckOutlined />
          <label>保存草稿</label>
        </li>
        <li className="tool-btn">
          <div>
            <SendOutlined />
            <label>发布</label>
          </div>
        </li>
      </ul>
      <Tool />
    </S.HeaderWrap>
  )
})

export default Header
