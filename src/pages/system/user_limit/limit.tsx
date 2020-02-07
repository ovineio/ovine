import { Tab, Tabs, Tree } from 'amis'
import { eachTree, mapTree } from 'amis/lib/utils/helper'
import React, { useEffect } from 'react'

import { routeLimitKey } from '~/constants'
import { convertLimitStr, limitMenusConfig } from '~/routes/limit'
import { LimitMenuItem } from '~/routes/types'
import { useImmer } from '~/utils/hooks'
import { getStore, setStore } from '~/utils/store'
import { isSubStr } from '~/utils/tool'

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
                value={selectedVal}
                valueField="nodePath"
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

// TODO：
// 接入 api 权限设置

// 处理 权限设置的值
const resolveSelectVal = (limitValue: string) => {
  const limits = convertLimitStr(limitValue)

  // 存在一个权限 则默认拥有根权限
  if (limitValue) {
    limits['/'] = true
  }

  eachTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { needs, nodePath } = item
    if (!needs || isSubStr(nodePath, routeLimitKey)) {
      return
    }

    let omit = false
    needs.forEach((needK) => {
      if (!omit && !limits[needK]) {
        omit = true
      }
    })

    // 前置权限被取消，依赖它的权限，都被取消
    if (omit) {
      delete limits[nodePath]
    }
  })

  return Object.values(limits).join(',')
}

// 处理 权限配置表
const resolveLimitMenus = (limitValue: string) => {
  const limits = convertLimitStr(limitValue)
  return mapTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { needs, nodePath } = item
    if (!needs || isSubStr(nodePath, routeLimitKey)) {
      return item
    }

    // 不满足依赖的权限 值被禁用
    let disabled = false
    needs.forEach((needK) => {
      if (!disabled && !limits[needK]) {
        disabled = true
      }
    })

    item.disabled = disabled
    return item
  })
}
