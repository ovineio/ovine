/**
 * APP 消息通知
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
      theme={theme}
      faIcon="bell"
      itemContent={
        <div>
          <ul>
            <li>查看信息</li>
            <li>退出登录</li>
          </ul>
        </div>
      }
    />
  )
}
