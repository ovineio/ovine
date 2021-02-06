import React from 'react'

import AimOutlined from '@ant-design/icons/AimOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import CopyOutlined from '@ant-design/icons/CopyOutlined'
import PlusOutlined from '@ant-design/icons/PlusOutlined'

import { store } from '../../store'

import * as S from './styled'

//
export const TableTool = (props) => {
  const { id } = props

  const onAction = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { type } = e.currentTarget.dataset
    switch (type) {
      case 'focus':
        store.graph.canvas.focusNodeWithAnimate(id)
        break
      case 'remove':
        store.graph.canvas.focusNodeWithAnimate(id)
        break
      default:
    }
  }

  return (
    <S.TableTool className="tool-bar">
      <AimOutlined data-type="focus" onClick={onAction} />
      <CloseOutlined data-type="remove" onClick={onAction} />
    </S.TableTool>
  )
}

//
export const FieldTool = (props) => {
  const { id } = props

  const onAction = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { type } = e.currentTarget.dataset
    switch (type) {
      case 'focus':
        store.graph.canvas.focusNodeWithAnimate(id)
        break
      case 'remove':
        store.graph.canvas.focusNodeWithAnimate(id)
        break
      default:
    }
  }

  return (
    <S.FieldTool className="tool-bar">
      <PlusOutlined data-type="add" onClick={onAction} />
      <CopyOutlined data-type="copy" onClick={onAction} />
      <CloseOutlined data-type="remove" onClick={onAction} />
    </S.FieldTool>
  )
}
