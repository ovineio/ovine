import { Tab, Tabs, Tree } from 'amis'
import { mapTree } from 'amis/lib/utils/helper'
import map from 'lodash/map'
import React, { useEffect } from 'react'

import { routesConfig } from '~/routes/config'
import { getPageFilePath, getPagePreset, getRoutePath } from '~/routes/route'
import { useImmer } from '~/utils/hooks'

import { StyledLimit } from './styled'

// TODO：
// 设置项足够多的时候， 搜索 tree， 显示tab，并滚动条对应到节点位置，并高亮显示
type State = {
  activeTab: number
}
export const Limit = (props: any) => {
  const { classPrefix, render } = props
  const [state, setState] = useImmer<State>({
    activeTab: 0,
  })

  const { activeTab } = state

  useEffect(() => {
    //
  }, [])

  const onTreeChange = (...args: any) => {
    //
    //
  }

  const onTabSelect = (tab: number) => {
    setState((d) => {
      d.activeTab = tab
    })
  }

  const renderButtons = () => {
    return render('', {
      type: 'button-toolbar',
      data: {
        isFold: true,
      },
      buttons: [
        {
          type: 'button-group',
          buttons: [
            {
              type: 'button',
              label: '展开',
            },
            {
              type: 'button',
              label: '折叠',
              className: 'is-active',
            },
            {
              type: 'button',
              label: '重置',
            },
          ],
        },
        {
          type: 'button',
          icon: 'fa fa-check text-success',
          tooltipPlacement: 'top',
          tooltip: '提交',
        },
        {
          type: 'button',
          icon: 'fa fa-times text-danger',
          tooltip: '关闭',
          tooltipPlacement: 'top',
        },
      ],
    })
  }

  return (
    <StyledLimit ns={classPrefix}>
      <div className="action-btns">{renderButtons()}</div>
      <Tabs {...props} activeKey={activeTab} mode="line" onSelect={onTabSelect}>
        {limitOption.map((item: any, index: number) => {
          if (!item.children) {
            return
          }
          return (
            <Tab key={index} title={item.label} icon={item.icon} eventKey={index}>
              <Tree
                {...props}
                hideRoot
                multiple
                withChildren
                options={item.children}
                onChange={onTreeChange}
              />
            </Tab>
          )
        })}
      </Tabs>
    </StyledLimit>
  )
}

const limitOption = mapTree(routesConfig, (item) => {
  const newItem = { ...item }

  const filePath = getPageFilePath(item)
  const preset = getPagePreset(filePath) || {}

  if (preset.limits) {
    newItem.children = map(preset.limits, (limitItem, limitKey) => {
      return {
        value: limitKey,
        label: limitItem.label,
        icon: limitItem.icon ? limitItem.icon : 'fa fa-code',
      }
    })
  }

  newItem.icon = newItem.icon ? newItem.icon : 'fa fa-code-fork'

  return newItem
})
