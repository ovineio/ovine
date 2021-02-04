import { observer } from 'mobx-react'
import React from 'react'

import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import InsertRowAboveOutlined from '@ant-design/icons/InsertRowAboveOutlined'

import { Amis } from '@core/components/amis/schema'

import { useStore } from '../../store'
import * as S from './styled'
import { updateFieldSchema, updateTableSchema } from './tpl'

const Settings = observer(() => {
  const { activeFieldInfo, activeNodeInfo, activeId, activeFieldId } = useStore()
  const hasActive = activeFieldInfo || activeNodeInfo

  return (
    <S.SettingsWrap>
      <S.Header>
        {hasActive ? (
          <>
            <InsertRowAboveOutlined />
            <span>
              {activeFieldInfo
                ? `${activeNodeInfo.label} > ${activeFieldInfo.label}`
                : activeNodeInfo.label}
            </span>
          </>
        ) : (
          <>
            <InfoCircleOutlined />
            <span>模型信息</span>
          </>
        )}
      </S.Header>
      <S.Body>
        {hasActive ? (
          <Amis
            key={activeFieldId || activeId}
            schema={activeFieldInfo ? updateFieldSchema : updateTableSchema}
          />
        ) : (
          <div>请选择编辑对象</div>
        )}
      </S.Body>
    </S.SettingsWrap>
  )
})

export default Settings
