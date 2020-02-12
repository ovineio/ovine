/**
 * APP 消息通知
 */

import { Tab, Tabs } from 'amis'
import React from 'react'

import { withAppTheme } from '~/theme'
import { useImmer } from '~/utils/hooks'

import HeadItem from './head_item'
import { PopupMsgMenu } from './styled'

export default () => {
  return (
    <HeadItem
      faIcon="bell"
      tip="消息"
      trigger="click"
      tooltipClassName="app-tool-tip"
      triggerContent={<MsgContent />}
    />
  )
}

type TabsState = {
  activeTab: string
}
const MsgContent = withAppTheme<{}>((props) => {
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
    <PopupMsgMenu>
      <Tabs theme={props.theme.name} mode="line" activeKey={activeTab} onSelect={onTabSelect}>
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
})
