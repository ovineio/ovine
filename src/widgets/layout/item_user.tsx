/**
 * APP 登录用户信息 与 相关操作
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
        src="https://img-photo.sumeme.com/15/7/64065743_null.jpg?v=1577188702893&imageMogr2/format/jpg/crop/!2164x2164a403a0/quality/75/thumbnail/400x400"
      />
      <span>梦醒十分2</span>
    </HeadItem>
  )
}
