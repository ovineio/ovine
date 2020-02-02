/**
 * APP 登录用户信息
 */

import React from 'react'

import HeadItem from './head_item'

type Props = {
  theme: string
}
export default (props: Props) => {
  const { theme } = props
  return (
    <HeadItem
      className="no-padder m-l-sm"
      theme={theme}
      itemContent={
        <div>
          <ul>
            <li>查看信息1</li>
            <li>退出登录</li>
          </ul>
        </div>
      }
    >
      <img
        className="w-2x m-r-xs"
        src="https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg"
      />
      <span>梦醒十分2</span>
    </HeadItem>
  )
}
