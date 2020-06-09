/**
 * 解析系统操作路径
 * --
 * 可根据自己项目内部实现
 */

import { get } from 'lodash'
import React from 'react'

import { strDelimiter } from '@core/constants'
import { getActionAddrMap } from '@core/routes/config'

export const ActionAddrCell = (props) => {
  const { actionAddr } = props.data
  const addrMap = getActionAddrMap()
  const label = get(addrMap, `${actionAddr}.label`) || ''
  const [actionPath, actionItems] = label.split(strDelimiter)

  return (
    <td>
      {!actionPath ? (
        '-'
      ) : (
        <>
          <span>{actionPath}</span>
          <span className="p-l-sm">{actionItems}</span>
        </>
      )}
    </td>
  )
}
