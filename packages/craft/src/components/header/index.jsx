/**
 * 顶部工具栏
 */

import React from 'react'
import { observer } from 'mobx-react'
import cls from 'classnames'

import { useRootStore } from '@/stores'

import { StyledHeader } from './styled'

export default observer((props) => {
  const { isEditMode, setMode } = useRootStore()

  const { history } = props

  return (
    <StyledHeader>
      <ul>
        {isEditMode ? (
          <>
            <li onClick={() => setMode('stage')}>预览</li>
            <li
              className={cls({ disabled: !history.hasPreFrame })}
              onClick={() => history.goBack()}
            >
              撤销
            </li>
            <li
              className={cls({ disabled: !history.hasNextFrame })}
              onClick={() => history.goNext()}
            >
              恢复撤销
            </li>
          </>
        ) : (
          <li onClick={() => setMode('edit')}>退出预览</li>
        )}
        <li>保存</li>
      </ul>
    </StyledHeader>
  )
})
