import React from 'react'

import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import { Amis } from '@core/components/amis/schema'

import EmptyIcon from '../../icons/empty.svg'
import NoChooseIcon from '../../icons/no_choose.svg'
import NoSearchItemIcon from '../../icons/no_search_item.svg'

import PopOver from './popover'

import * as S from './styled'

export const NoField = (props) => {
  const { className = '', type = 'add', batchAddFields } = props

  const getFormSchema = (popProps) => ({
    type: 'form',
    mode: 'normal',
    wrapWithPanel: false,
    wrapperComponent: 'div',
    className: 'p-md p-b-none w-lg',
    title: '添加字段',
    onSubmit: ({ names }) => {
      // TODO: 字段名称不能重复
      batchAddFields(names.split(','))
      popProps.close()
    },
    controls: [
      {
        type: 'tag',
        name: 'names',
        placeholder: '请输入字段名，回车键可以输入多个字段',
        clearable: true,
        required: true,
      },
      {
        type: 'container',
        body: [
          {
            type: 'action',
            label: '取消',
            className: 'm-r-md',
            icon: 'fa fa-remove pull-left',
            onClick: popProps.close,
          },
          {
            type: 'action',
            label: '完成创建字段',
            level: 'primary',
            actionType: 'submit',
            icon: 'fa fa-check pull-left',
          },
        ],
      },
    ],
  })

  return (
    <S.NoField className={`${className} ${type}-type`}>
      <p>
        <EmptyIcon />
      </p>
      {type === 'add' ? (
        <PopOver
          placement="top"
          className="add-action"
          Popup={(popProps) => <Amis schema={getFormSchema(popProps)} />}
        >
          <PlusCircleOutlined />
          <span>添加字段</span>
        </PopOver>
      ) : (
        <span className="tip-text">{type === 'search' ? '未搜到字段' : '暂无字段'}</span>
      )}
    </S.NoField>
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

export const NoTable = (props) => {
  const { className = '', icon = 'empty', tip = '暂无模型' } = props

  const icons = {
    empty: <EmptyIcon />,
    noSearchItem: <NoSearchItemIcon />,
  }

  return (
    <S.NoSettingItem className={className}>
      <p>{icons[icon]}</p>
      <span>{tip}</span>
    </S.NoSettingItem>
  )
}
