/**
 * APP 登录用户信息
 */

import React from 'react'

import { userLogout } from '~/core/user/export'
import { useImmer } from '~/utils/hooks'

import { Amis } from '../amis/schema'

import HeadItem from './head_item'
import { PopupItemMenu } from './styled'

type State = {
  infoVisible: boolean
}
const initState: State = {
  infoVisible: false,
}
export default () => {
  const [state, setState] = useImmer<State>(initState)
  const { infoVisible } = state

  const toggleInfoDialog = () => {
    setState((d) => {
      d.infoVisible = !d.infoVisible
    })
  }

  const data = {
    avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
    nickname: '梦醒十分2323',
    signature:
      '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  }

  const infoDialog = {
    data,
    type: 'dialog',
    title: '您的个人信息',
    show: infoVisible,
    onClose: toggleInfoDialog,
    body: {
      type: 'form',
      controls: [
        {
          type: 'image',
          label: '头像',
          name: 'avatar',
        },
        {
          type: 'static',
          name: 'nickname',
          label: '昵称',
          value: '文本',
          quickEdit: true,
        },
        {
          type: 'static',
          name: 'signature',
          label: '个性签名',
          quickEdit: true,
        },
      ],
    },
  }

  return (
    <>
      <HeadItem
        className="no-padder m-l-sm"
        tip="用户信息"
        trigger="focus"
        triggerContent={
          <PopupItemMenu>
            <ul>
              {/* TODO: 点击后，弹出框没有消失 */}
              <li onClick={toggleInfoDialog}>
                <i className="glyphicon glyphicon-user" />
                <span>查看信息</span>
              </li>
              <li onClick={userLogout}>
                <i className="glyphicon glyphicon-log-out" />
                <span>退出登录</span>
              </li>
            </ul>
          </PopupItemMenu>
        }
      >
        <img
          className="w-2x m-r-xs"
          src="https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg"
        />
        <span>梦醒十分2</span>
      </HeadItem>
      <Amis schema={infoDialog} />
    </>
  )
}
