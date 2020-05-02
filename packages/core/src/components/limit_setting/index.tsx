/**
 * APP 权限设置模块
 */

import { Tab, Tabs, Tree } from 'amis'
import { eachTree, mapTree } from 'amis/lib/utils/helper'
import map from 'lodash/map'
import React, { useEffect, useRef, useMemo } from 'react'

import { routeLimitKey } from '@/constants'
import { getLimitMenus } from '@/routes/limit'
import { checkLimitByKeys, convertLimitStr } from '@/routes/limit/exports'
import { LimitMenuItem } from '@/routes/types'
import { useImmer } from '@/utils/hooks'
import { cls, isSubStr } from '@/utils/tool'

import { ObjectOf } from '@/utils/types'

import { Amis } from '../amis/schema'
import { StyledLimit } from './styled'

// TODO：
// 设置项足够多的时候， 搜索 tree， 显示tab，并滚动条对应到节点位置，并高亮显示
type State = {
  activeTab: number
  isUnfolded: boolean
  selectedVal: string
  visitedTabs: number[]
}
type Props = {
  authLimit?: string
  onSaveLimit?: (data: { authApi: string; authLimit: string }) => void
  onCancel?: () => void
  saveConfirmText?: string
}
const LimitSetting = (props: Props) => {
  const { authLimit: initLimit = '', onSaveLimit, onCancel, saveConfirmText } = props
  const [state, setState] = useImmer<State>({
    activeTab: 0,
    isUnfolded: true,
    visitedTabs: [],
    selectedVal: '',
  })
  const storeRef = useRef<ObjectOf<string>>({})

  const { activeTab, visitedTabs, selectedVal, isUnfolded } = state
  const menuConfig = useMemo(getLimitMenus, [])

  useEffect(() => {
    initData()
  }, [])

  function initData() {
    setState((d) => {
      // 初始化每个tab
      menuConfig.forEach((_, index) => {
        storeRef.current[index] = initLimit
      })
      d.selectedVal = initLimit
      d.visitedTabs = []
    })
  }

  const toggleFold = (toggle: boolean) => {
    setState((d) => {
      d.isUnfolded = toggle
    })
  }

  const onTreeChange = (value: string) => {
    const limitValue = resolveSelectVal(menuConfig, value)

    storeRef.current[activeTab] = limitValue
    setState((d) => {
      d.selectedVal = limitValue
      if (!d.visitedTabs.filter((tab) => tab === activeTab).length) {
        d.visitedTabs.push(activeTab)
      }
    })
  }

  const onTabSelect = (tab: string | number) => {
    setState((d) => {
      d.activeTab = Number(tab)
      d.selectedVal = storeRef.current[tab]
    })
  }

  const onSaveClick = () => {
    const authApi = getAllAuthApiStr(menuConfig, selectedVal)
    const authLimit = getAllAuthLimitStr(menuConfig, visitedTabs, storeRef.current)

    if (onSaveLimit) {
      onSaveLimit({
        authApi,
        authLimit,
      })
    }
    // if (isDevLimit) {
    //   setStore(storage.dev.limit, authLimit)
    //   setStore(storage.dev.api, authApi)
    //   setAppLimits(authLimit)
    //   window.location.reload()
    // }
  }

  const buttonsSchema = {
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
            onClick: initData,
          },
        ],
      },
      {
        type: 'button',
        icon: 'fa fa-check text-success',
        tooltipPlacement: 'top',
        actionType: 'cancel',
        confirmText: saveConfirmText,
        onAction: onSaveClick,
      },
      {
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'cancel',
        tooltipPlacement: 'top',
        confirmText: !visitedTabs.length ? '' : '关闭将视为您主动放弃本次修改。',
        onAction: onCancel,
      },
    ],
  }

  return (
    <StyledLimit>
      <div className="action-btns">
        <Amis schema={buttonsSchema} />
      </div>
      <Tabs {...props} activeKey={activeTab} mode="line" onSelect={onTabSelect}>
        {resolveLimitMenus(menuConfig, { limitValue: selectedVal, isUnfolded }).map(
          (item: any, index: number) => {
            if (!item.children) {
              return null
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
function resolveSelectVal(menusConfig: any[], limitValue: string) {
  const limits = convertLimitStr(limitValue)

  eachTree<LimitMenuItem>(menusConfig, (item) => {
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
function resolveLimitMenus(
  menusConfig: any[],
  option: { limitValue: string; isUnfolded?: boolean }
) {
  const { limitValue, isUnfolded = true } = option
  const limits = convertLimitStr(limitValue)

  return mapTree<LimitItem>(menusConfig, (item) => {
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

// 获取所有被允许的权限
function getAllAuthLimitStr(
  menusConfig: any[],
  visitedTabs: number[],
  store: ObjectOf<string>
): string {
  const limitValue: string[] = []

  map(store, (value, storeTab) => {
    const index = Number(storeTab)
    if (visitedTabs.findIndex((tab) => tab === index) > -1) {
      limitValue.push(value)
      return
    }
    eachTree(menusConfig[index]?.children || [], (item) => {
      const limits = convertLimitStr(value)
      if (limits[item.nodePath]) {
        limitValue.push(item.nodePath)
      }
    })
  })

  return limitValue.join(',')
}

// 获取所有 被允许的 api
function getAllAuthApiStr(menusConfig: any[], limitValue: string) {
  const limits = convertLimitStr(limitValue)
  const authApis: any = {}

  eachTree<LimitMenuItem>(menusConfig, (item) => {
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
