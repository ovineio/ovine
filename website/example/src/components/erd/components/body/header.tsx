import { throttle } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CompressOutlined from '@ant-design/icons/CompressOutlined'
import DisconnectOutlined from '@ant-design/icons/DisconnectOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import FullscreenExitOutlined from '@ant-design/icons/FullscreenExitOutlined'
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined'
import HighlightOutlined from '@ant-design/icons/HighlightOutlined'
import LinkOutlined from '@ant-design/icons/LinkOutlined'
import OneToOneOutlined from '@ant-design/icons/OneToOneOutlined'
import RedoOutlined from '@ant-design/icons/RedoOutlined'
import UndoOutlined from '@ant-design/icons/UndoOutlined'
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined'
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined'

import { useStore } from '../../sotre'
import * as S from './styled'

const Tool = (props: { canvas: any }) => {
  const { canvas } = props

  const [scale, setScale] = useState(0)
  const $container = document.querySelector('.butterfly-react-container')

  useEffect(() => {
    if (canvas.getZoom) {
      setScale(canvas.getZoom())
    }
  }, [canvas])

  useEffect(() => {
    if (canvas.zoom) {
      canvas.zoom(scale)
    }
  }, [scale])

  const zoomIn = throttle(() => {
    setScale(scale + 0.1)
  }, 150)

  const zoomOut = throttle(() => {
    setScale(scale - 0.1)
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
        <li onClick={zoomIn}>
          <ZoomInOutlined />
        </li>
        <li onClick={zoomOut}>
          <ZoomOutOutlined />
        </li>
      </ul>
    </S.ToolWrap>,
    $container
  )
}

const Header = observer(() => {
  const {
    canvas,
    readOnly,
    toggleReadOnly,
    clickLink,
    toggleClickLink,
    fullScreen,
    toggleFullScreen,
  } = useStore()

  const undo = () => {
    canvas.undo()
  }

  const redo = () => {
    canvas.redo()
  }

  return (
    <S.HeaderWrap>
      <ul className="header-bar">
        <li onClick={undo}>
          <RedoOutlined />
        </li>
        <li onClick={redo}>
          <UndoOutlined />
        </li>
        <li onClick={toggleReadOnly}>{readOnly ? <EyeOutlined /> : <HighlightOutlined />}</li>
        <li onClick={toggleFullScreen}>
          {fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </li>
        <li onClick={toggleClickLink}>{clickLink ? <DisconnectOutlined /> : <LinkOutlined />}</li>
        <li>
          <CheckOutlined />
        </li>
      </ul>
      <Tool canvas={canvas} />
    </S.HeaderWrap>
  )
})

export default Header
