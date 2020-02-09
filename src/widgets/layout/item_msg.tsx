/**
 * APP 消息通知
 */

import { Tab, Tabs } from 'amis'
import React from 'react'

import { useImmer } from '~/utils/hooks'

import { themes } from './common'
import HeadItem from './head_item'
import { PopupMsgMenu } from './styled'

type Props = {
  theme: string
}

export default (props: Props) => {
  const { theme } = props

  return (
    <HeadItem
      theme={theme}
      faIcon="bell"
      tip="消息"
      trigger="click"
      tooltipClassName="app-tool-tip"
      triggerContent={<MsgContent theme={theme} />}
    />
  )
}

type TabsState = {
  activeTab: string
}
const MsgContent = (props: { theme: string }) => {
  const { theme } = props
  const [state, setState] = useImmer<TabsState>({
    activeTab: 'notify',
  })

  const { activeTab } = state

  const onTabSelect = (tab: any) => {
    setState((d) => {
      d.activeTab = tab
    })
  }

  return (
    <PopupMsgMenu ns={themes[theme].ns}>
      <Tabs theme={theme} mode="line" activeKey={activeTab} onSelect={onTabSelect}>
        <Tab eventKey="notify" title="通知">
          通知模块，该功能正在开发中...
        </Tab>
        <Tab eventKey="message" title="消息">
          消息模块，该功能正在开发中...
        </Tab>
        <Tab eventKey="unprocessed" title="待处理">
          待处理模块，该功能正在开发中...
        </Tab>
      </Tabs>
    </PopupMsgMenu>
  )
}
