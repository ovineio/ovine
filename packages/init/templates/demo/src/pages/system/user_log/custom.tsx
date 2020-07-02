/**
 * 解析系统操作路径
 * 基本能做到，项目每一个请求的的日志
 * --
 * 可根据自己项目内部实现
 */

import { get, map } from 'lodash'
import React from 'react'

import { strDelimiter } from '@core/constants'
import { getActionAddrMap } from '@core/routes/config'

import { apis } from '~/app/common/apis'

// 操作路径 解析
export const getActionAddrData = (transOptions?: boolean) => {
  const actionAddrData = getActionAddrMap()

  // 自定义 API 默认都有权限
  map(apis, ({ url, actionDesc }) => {
    if (url.indexOf('GET ') === -1) {
      actionAddrData[url] = {
        actionDesc,
        api: url,
        label: actionDesc,
        auth: true,
      }
    }
  })

  // 用于 table cell 展示
  if (!transOptions) {
    return actionAddrData
  }

  // 操作路径 select 选项
  const actionsArr = []
  map(actionAddrData, ({ label, actionDesc, api, auth }, key) => {
    const labelStr = label || actionDesc || '-'
    const [actionPath, actionItems = ''] = labelStr.split(strDelimiter)

    if (api.indexOf('GET ') === -1 && auth) {
      actionsArr.push({
        value: key,
        label: `${actionPath} ${actionItems}`,
      })
    }
  })

  return actionsArr
}

// 操作路径列显示
export const ActionAddrCell = (props) => {
  const { actionAddr } = props.data
  const { label = '', api, auth = false } = get(getActionAddrData(), actionAddr) || {}
  const [actionPath, actionItems = ''] = label.split(strDelimiter)

  return (
    <td>
      {!auth || !actionPath ? (
        api || '-'
      ) : (
        <>
          <span>{actionPath}</span>
          <span className="p-l-sm">{actionItems}</span>
        </>
      )}
    </td>
  )
}
