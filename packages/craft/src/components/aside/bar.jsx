/**
 * 切换框
 * 主页页面
 * 页面请求
 * 页面操作
 * 页面弹窗
 * 页面权限
 * 公共模版
 */

import React from 'react'
import { map } from 'lodash'
import cls from 'classnames'
import { observer } from 'mobx-react'

import { tabs, useAsideStore } from './store'

import { StyledBar } from './styled'

export default observer(() => {
  const { setTab, tab: activeTab } = useAsideStore()

  const onTabClick = (e) => {
    const { tab } = e.currentTarget.dataset
    setTab(tab)
  }

  return (
    <StyledBar>
      <ul>
        {map(tabs, (tab, tabKey) => {
          return (
            <li
              key={tabKey}
              data-tab={tabKey}
              className={cls({ active: activeTab === tabKey })}
              onClick={onTabClick}
            >
              {tab.title}
            </li>
          )
        })}
      </ul>
    </StyledBar>
  )
})
