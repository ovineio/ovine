import React from 'react'

import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'

import EmptyIcon from '../../icons/empty.svg'
import NoChooseIcon from '../../icons/no_choose.svg'

import * as S from './styled'

export const NoFields = (props) => {
  const { className = '' } = props
  return (
    <S.NoFields className={className}>
      <p>
        <EmptyIcon />
      </p>
      <div>
        <PlusCircleOutlined />
        <span>添加字段</span>
      </div>
    </S.NoFields>
  )
}

export const NoSettingItem = (props) => {
  const { className = '' } = props
  return (
    <S.NoSettingItem className={className}>
      <p>
        <NoChooseIcon />
      </p>
      <span>暂无选择的模型</span>
    </S.NoSettingItem>
  )
}
