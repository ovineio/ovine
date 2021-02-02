import { throttle } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import { useStore } from '../../sotre'
import * as S from './styled'

const Tool = (props: { canvas: any }) => {
  const { canvas } = props

  const [scale, setScale] = useState(0)

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

  return (
    <S.ToolWrap>
      <ul>
        <li onClick={zoomFit}>适应窗口</li>
        <li onClick={zoomNormal}>正常比例</li>
        <li onClick={zoomIn}>放大</li>
        <li onClick={zoomOut}>缩小</li>
      </ul>
    </S.ToolWrap>
  )
}

const Header = observer(() => {
  const { canvas, readOnly, toggleReadOnly, clickLink, toggleClickLink } = useStore()

  const undo = () => {
    canvas.undo()
  }

  const redo = () => {
    canvas.redo()
  }

  return (
    <S.HeaderWrap>
      <ul>
        <li onClick={undo}>重做</li>
        <li onClick={redo}>回退</li>
        <li onClick={toggleReadOnly}>{readOnly ? '启用编辑' : '只读模式'}</li>
        <li onClick={toggleClickLink}>{clickLink ? '取消选择' : '选择关联'}</li>
        <li>保存</li>
      </ul>
      <Tool canvas={canvas} />
    </S.HeaderWrap>
  )
})

export default Header
