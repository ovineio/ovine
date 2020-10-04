/**
 * 编辑器 侧边栏
 *
 * 主要用于导航
 *
 */

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { Tab, Tabs } from 'amis'
import { map } from 'lodash'

import { app } from '@core/app'

import { useRootStore } from '@/stores'

import Bar from './bar'
import allTab from './tab'
import Nodes from './nodes'

import { StyledAside, StyledContent } from './styled'

import { tabs, AsideProvider, asideStore, useAsideStore } from './store'

const Aside = observer(() => {
  const { isStageMode } = useRootStore()
  const { isShowNodes, tab: activeTab, setTab } = useAsideStore()

  const theme = app.theme.getName()

  useEffect(() => {
    const $tabs = $('.craft-aside-tab')

    // 添加悬浮提示提示
    $tabs
      .find('li')
      .each((index, item) => {
        const info = Object.values(tabs)[index] || {}
        const $item = $(item)
        $item.attr({
          'data-toggle': 'tooltip',
          'data-placement': 'right',
          title: $item.attr('title') || info.title,
        })
      })
      .tooltip()
  }, [])

  return (
    <StyledAside className={isStageMode ? 'd-none' : 'd-flex'}>
      <Tabs
        className="craft-aside-tab"
        mode="vertical"
        theme={theme}
        activeKey={activeTab}
        onSelect={setTab}
        toolbar={
          <li className="item-code" title="页面配置">
            <i className=" fa fa-code" />
          </li>
        }
      >
        {map(tabs, (info, tab) => {
          const TabContent = allTab[_.upperFirst(tab)]
          return (
            <Tab key={tab} theme={theme} icon={info.icon} eventKey={tab}>
              {TabContent && <TabContent />}
            </Tab>
          )
        })}
      </Tabs>
    </StyledAside>
  )
})

export default () => {
  return (
    <AsideProvider value={asideStore}>
      <Aside />
    </AsideProvider>
  )
}
