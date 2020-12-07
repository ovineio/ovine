/**
 * socket 弹窗应用举例
 */

import React, { useEffect } from 'react'

import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'
import { subscribe } from '@core/utils/message'

// 审批弹窗
const ApplyDialog = () => {
  // 设置初始化状态
  const [state, setState] = useImmer<any>({
    isShow: false, // 不显示弹窗
    socketData: {}, // socket推送数据
  })

  // 显示/关闭  弹窗
  const toggleShow = () => {
    setState((d) => {
      // 设置状态  === d 表示 原始状态
      d.isShow = !d.isShow // 新状态 变为 原始的相反状态
    })
  }

  useEffect(() => {
    // 接收 socket 消息推送
    subscribe('socket:applyDialogShow', (socketData: any) => {
      // 设置状态
      setState((d) => {
        d.isShow = true
        d.socketData = socketData
      })
    })
  }, [])

  const { isShow, socketData } = state

  const dialogSchema = {
    type: 'dialog',
    size: 'md',
    show: isShow, // 控制是否显示
    onClose: toggleShow, // 弹窗关闭回调
    data: socketData, // socket 推送的一些初始化参数
    title: '审批弹窗',
    body: {
      type: 'form',
      controls: [
        {
          type: 'text',
          name: 'nameKey',
        },
      ],
    },
  }

  return <Amis schema={dialogSchema} />
}

// 此处用于举例，可以由socket控制显示其他内容
// 可以和上边类似
export const ShowQrCode = () => {
  return null
}

// 全局 socket 弹窗处理中心, 所有推送逻辑可以在这里处理
export const SocketDialogManger = () => {
  return (
    <>
      <ApplyDialog />
      <ShowQrCode />
    </>
  )
}
