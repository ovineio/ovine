/**
 * 编辑器 侧边栏
 *
 * 主要用于导航
 *
 */

import { Tab, Tabs } from 'amis'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import { app } from '@core/app'

import { useRootStore } from '@/stores'

import { tabs, AsideProvider, asideStore, useAsideStore } from './store'
import { StyledAside } from './styled'
import allTab from './tab'

const Aside = observer(() => {
  const { isStageMode } = useRootStore()
  const { tab: activeTab, setTab } = useAsideStore()

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
        {_.map(tabs, (info, tab) => {
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
