/**
 * APP 登录用户信息
 */

import React from 'react'

import HeadItem from './head_item'
import { PopupUserMenu } from './styled'

type Props = {
  theme: string
}
export default (props: Props) => {
  const { theme } = props

  return (
    <HeadItem
      theme={theme}
      className="no-padder m-l-sm"
      tip="用户信息"
      trigger="click"
      triggerContent={<UserContent />}
    >
      <img
        className="w-2x m-r-xs"
        src="https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg"
      />
      <span>梦醒十分2</span>
    </HeadItem>
  )
}

export const UserContent = () => {
  return (
    <PopupUserMenu>
      <ul>
        <li className="b-b">
          <i className="glyphicon glyphicon-user" />
          <span>查看信息</span>
        </li>
        <li>
          <i className="glyphicon glyphicon-log-out" />
          <span>退出登录</span>
        </li>
      </ul>
    </PopupUserMenu>
  )
}
