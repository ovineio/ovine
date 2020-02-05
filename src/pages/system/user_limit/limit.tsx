import { Tab, Tabs, Tree } from 'amis'
import { eachTree, mapTree } from 'amis/lib/utils/helper'
import React, { useEffect } from 'react'

import { routeLimitKey } from '~/constants'
import { limitMenusConfig } from '~/routes/limit'
import { LimitMenuItem } from '~/routes/types'
import { useImmer } from '~/utils/hooks'
import { getStore, setStore } from '~/utils/store'

import { StyledLimit } from './styled'

// TODO：
// 设置项足够多的时候， 搜索 tree， 显示tab，并滚动条对应到节点位置，并高亮显示
type State = {
  activeTab: number
  selectedVal: string
}
export const Limit = (props: any) => {
  const { classPrefix, render } = props
  const [state, setState] = useImmer<State>({
    activeTab: 0,
    selectedVal: '',
  })

  const { activeTab, selectedVal } = state

  useEffect(() => {
    setState((d) => {
      d.selectedVal = getStore('limit') || ''
    })
  }, [])

  const onTreeChange = (value: string) => {
    setState((d) => {
      d.selectedVal = resolveSelectVal(value)
    })
  }

  const onTabSelect = (tab: number) => {
    setState((d) => {
      d.activeTab = tab
    })
  }

  const onSave = () => {
    setStore('limit', selectedVal)
  }

  const renderButtons = () => {
    return render('body', {
      type: 'button-toolbar',
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
          onClick: onSave,
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
        {resolveLimitMenus(selectedVal).map((item: any, index: number) => {
          if (!item.children) {
            return
          }
          return (
            <Tab key={index} title={item.label} icon={item.icon} eventKey={index}>
              <Tree
                {...props}
                hideRoot
                multiple
                joinValues
                withChildren
                onlyChildren
                value={selectedVal}
                valueField="limitKey"
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

// 解析 权限设置的 值
const resolveSelectVal = (limitValue: string) => {
  const limits = limitValue.split(',')
  eachTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { needs, limitKey } = item
    if (!limitKey || !needs || limitKey === routeLimitKey) {
      return
    }

    let omit = false
    needs.forEach((needK) => {
      if (!omit && !limits.find((v) => v === needK)) {
        omit = true
      }
    })

    // 前置权限被取消，依赖它的权限，都被取消
    if (omit) {
      const idx = limits.indexOf(limitKey)
      if (idx !== -1) {
        limits.splice(limits.indexOf(limitKey), 1)
      }
    }
  })

  return limits.join(',')
}

// 处理权限配置
const resolveLimitMenus = (limitValue: string) => {
  const limits = limitValue.split(',')
  return mapTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { needs, limitKey } = item
    if (!needs || limitKey === routeLimitKey) {
      return item
    }

    // 不满足依赖的权限 值被禁用
    let disabled = false
    needs.forEach((needK) => {
      if (!disabled && !limits.find((v) => v === needK)) {
        disabled = true
      }
    })

    item.disabled = disabled
    return item
  })
}
