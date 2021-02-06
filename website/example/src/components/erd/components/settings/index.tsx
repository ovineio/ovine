import cls from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'

import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import RollbackOutlined from '@ant-design/icons/RollbackOutlined'
import VerticalAlignBottomOutlined from '@ant-design/icons/VerticalAlignBottomOutlined'
import VerticalLeftOutlined from '@ant-design/icons/VerticalLeftOutlined'
import VerticalRightOutlined from '@ant-design/icons/VerticalRightOutlined'
import { Amis } from '@core/components/amis/schema'

import ScrollBar from '~/components/scroll_bar'

import { useStore } from '../../store'
import { NoSettingItem } from '../state/null_data'

import * as S from './styled'
import { getUpdateTableSchema, getUpdateFieldSchema } from './tpl'


const Heder = observer(() => {
  const {
    hasActiveItem,
    activeFieldId,
    activeItemNavInfo: nav,
    navigateActiveItem: navTo,
  } = useStore()

  const onAction = (e) => {
    const { action } = e.currentTarget.dataset
    if (!nav[action]) {
      return
    }

    const nextIndex = action === 'next' ? nav.index + 1 : nav.index - 1

    navTo(action, nextIndex)
  }

  return (
    <S.Header>
      <div className="hd-label">
        <InfoCircleOutlined />
        <span>{activeFieldId ? '字段信息' : '模型信息'}</span>
      </div>
      {hasActiveItem && (
        <ul className="erd-hd-toolbar">
          {activeFieldId ? (
            <li data-action="out" onClick={onAction}>
              <RollbackOutlined className={cls({ disabled: !nav.out })} />
            </li>
          ) : (
            <li data-action="in" onClick={onAction}>
              <VerticalAlignBottomOutlined className={cls({ disabled: !nav.in })} />
            </li>
          )}
          <li data-action="pre" onClick={onAction}>
            <VerticalRightOutlined className={cls({ disabled: !nav.pre })} />
          </li>
          <li data-action="next" onClick={onAction}>
            <VerticalLeftOutlined className={cls({ disabled: !nav.next })} />
          </li>
        </ul>
      )}
    </S.Header>
  )
})

const Settings = observer(() => {
  const { activeFieldInfo, hasActiveItem, activeId, activeFieldId } = useStore()

  return (
    <S.SettingsWrap>
      <Heder />
      <S.Body>
        {hasActiveItem ? (
          <ScrollBar>
            <Amis
              key={activeFieldId || activeId}
              schema={activeFieldInfo ? getUpdateFieldSchema() : getUpdateTableSchema()}
            />
          </ScrollBar>
        ) : (
          <NoSettingItem />
        )}
      </S.Body>
    </S.SettingsWrap>
  )
})

export default Settings
