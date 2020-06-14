/**
 * 解析系统操作路径
 * --
 * 可根据自己项目内部实现
 */

import { get, map } from 'lodash'
import React from 'react'

import { strDelimiter } from '@core/constants'
import { getActionAddrMap } from '@core/routes/config'

import { apis } from '~/app/common/apis'

// 操作路径 解析
export const getActionAddrData = (transOptions) => {
  const actionAddrData = getActionAddrMap()
  map(apis, ({ url, actionDesc }) => {
    if (url.indexOf('GET ') === -1) {
      actionAddrData[url] = {
        actionDesc,
        api: url,
        label: actionDesc,
      }
    }
  })

  if (!transOptions) {
    return actionAddrData
  }

  return map(actionAddrData, ({ label, actionDesc }, key) => {
    const labelStr = label || actionDesc || '-'
    const [actionPath, actionItems = ''] = labelStr.split(strDelimiter)
    return {
      value: key,
      label: `${actionPath} ${actionItems}`,
    }
  })
}

// 操作路径列显示
export const ActionAddrCell = (props) => {
  const { actionAddr } = props.data
  const label = (get(getActionAddrData(), `${actionAddr}.label`) || '')
  const [actionPath, actionItems = ''] = label.split(strDelimiter)

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
