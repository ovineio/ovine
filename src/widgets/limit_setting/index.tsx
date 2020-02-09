import { Tab, Tabs, Tree } from 'amis'
import { eachTree, mapTree } from 'amis/lib/utils/helper'
import React, { useEffect, useRef } from 'react'

import { routeLimitKey } from '~/constants'
import { checkLimitByKeys, convertLimitStr, limitMenusConfig } from '~/routes/limit'
import { LimitMenuItem } from '~/routes/types'
import { useImmer } from '~/utils/hooks'
import { getStore, setStore } from '~/utils/store'
import { cls, isSubStr } from '~/utils/tool'

import { StyledLimit } from './styled'

// TODO：
// 设置项足够多的时候， 搜索 tree， 显示tab，并滚动条对应到节点位置，并高亮显示
type State = {
  activeTab: number
  isUnfolded: boolean
  initialSelectedVal: string
  selectedVal: string
}
const LimitSetting = (props: any) => {
  const { classPrefix, render, data } = props
  const [state, setState] = useImmer<State>({
    activeTab: 0,
    isUnfolded: true,
    initialSelectedVal: '',
    selectedVal: '',
  })
  const storeRef = useRef<any>({})

  const { activeTab, initialSelectedVal, selectedVal, isUnfolded } = state

  useEffect(() => {
    setState((d) => {
      const initialVal = getStore<string>('limit') || ''
      d.selectedVal = initialVal
      storeRef.current[activeTab] = initialVal
      d.initialSelectedVal = initialVal
    })
  }, [])

  const toggleFold = (toggle: boolean) => {
    setState((d) => {
      d.isUnfolded = toggle
    })
  }

  const onTreeChange = (value: string) => {
    const limitValue = resolveSelectVal(value)
    storeRef.current[activeTab] = limitValue
    setState((d) => {
      d.selectedVal = limitValue
    })
  }

  const onTabSelect = (tab: number) => {
    setState((d) => {
      d.activeTab = tab
      d.selectedVal = storeRef.current[tab]
    })
  }

  const onSave = () => {
    setState((d) => {
      d.initialSelectedVal = selectedVal
    })
    const apiValue = getAllAuthApis(selectedVal)
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
              className: cls({ 'is-active': isUnfolded === true }),
              onClick: () => toggleFold(true),
            },
            {
              type: 'button',
              label: '折叠',
              className: cls({ 'is-active': isUnfolded === false }),
              onClick: () => toggleFold(false),
            },
            {
              type: 'button',
              label: '重置',
              onClick: () =>
                setState((d) => {
                  d.selectedVal = d.initialSelectedVal
                }),
            },
          ],
        },
        {
          type: 'button',
          icon: 'fa fa-check text-success',
          tooltipPlacement: 'top',
          actionType: 'cancel',
          confirmText: `您正在修改的权限是【${data.name}】，提交后将不可重置，是否确认提交？`,
          onAction: onSave,
        },
        {
          type: 'button',
          icon: 'fa fa-times text-danger',
          tooltip: '关闭',
          actionType: 'cancel',
          tooltipPlacement: 'top',
          confirmText: `${
            initialSelectedVal === selectedVal ? '' : '关闭将视为您主动放弃本次修改。'
          }`,
        },
      ],
    })
  }

  return (
    <StyledLimit ns={classPrefix}>
      <div className="action-btns">{renderButtons()}</div>
      <Tabs {...props} activeKey={activeTab} mode="line" onSelect={onTabSelect}>
        {resolveLimitMenus({ limitValue: selectedVal, isUnfolded }).map(
          (item: any, index: number) => {
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
          }
        )}
      </Tabs>
    </StyledLimit>
  )
}

// 处理 权限设置的值
const resolveSelectVal = (limitValue: string) => {
  const limits = convertLimitStr(limitValue)

  eachTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { needs, nodePath } = item
    if (!needs || isSubStr(nodePath, routeLimitKey)) {
      return
    }

    // 前置权限不满足时，自动撤销
    const omit = !checkLimitByKeys(needs, { nodePath, limits })

    if (omit) {
      delete limits[nodePath]
    }
  })

  const newLimitValue = Object.keys(limits).join(',')

  return newLimitValue
}

type LimitItem = LimitMenuItem & {
  unfolded: boolean
}

// 处理 权限配置表
const resolveLimitMenus = (option: { limitValue: string; isUnfolded?: boolean }) => {
  const { limitValue, isUnfolded = true } = option
  const limits = convertLimitStr(limitValue)

  return mapTree<LimitItem>(limitMenusConfig, (item) => {
    const { needs, nodePath } = item

    item.unfolded = isUnfolded

    if (!needs || isSubStr(nodePath, routeLimitKey)) {
      return item
    }

    // 前置权限不满足时，禁用
    item.disabled = !checkLimitByKeys(needs, { nodePath, limits })

    return item
  })
}

// 获取所有 被允许的 api
const getAllAuthApis = (limitValue: string) => {
  const limits = convertLimitStr(limitValue)
  const authApis: any = {}

  eachTree<LimitMenuItem>(limitMenusConfig, (item) => {
    const { nodePath, apis } = item

    if (!apis) {
      return
    }

    Object.values(apis).forEach((apiItem) => {
      const { url, key, limits: needs } = apiItem
      const auth = !needs ? true : checkLimitByKeys(needs, { nodePath, limits })
      if (auth) {
        authApis[key || url] = true
      }
    })
  })

  const apiValue = Object.keys(authApis).join(',')

  return apiValue
}

export default LimitSetting
