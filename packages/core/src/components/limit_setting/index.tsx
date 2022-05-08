/**
 * APP 权限设置模块
 */

import { toast } from 'amis'
import Tabs, { Tab } from 'amis/lib/components/Tabs'
import TreeSelector from 'amis/lib/components/Tree'

import { RendererProps } from 'amis/lib/factory'
import { eachTree, mapTree, flattenTree } from 'amis/lib/utils/helper'
import { map, omitBy } from 'lodash'
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
  selectedVal: string
  visitedTabs: number[]
  isUnfolded?: boolean
}
export type AuthLimitData = {
  authApi: string
  authLimit: string
}
export type LimitSettingProps = Partial<RendererProps> & {
  limit?: string
  saveConfirmText?: string
  className?: string
  useAllLimit?: boolean
  onSaveClick?: (authLimitData: AuthLimitData) => void
  onCancelClick?: () => void
}

const LimitSetting = (props: LimitSettingProps) => {
  const {
    limit: initLimit = '',
    useAllLimit,
    className,
    saveConfirmText,
    onCancelClick,
    render,
  } = props

  const [state, setState] = useImmer<State>({
    activeTab: 0,
    isUnfolded: true,
    visitedTabs: [],
    selectedVal: '',
  })

  const storeRef = useRef<ObjectOf<string>>({})
  const { activeTab, visitedTabs, selectedVal, isUnfolded } = state
  const menuConfig = useMemo(() => getLimitMenus({ useAllLimit }), [])

  useEffect(() => {
    initData()
  }, [initLimit])

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

  // TODO: 引起 体验不流畅  Tree 折叠BUG
  const onTreeChange = (value: string) => {
    const limitValue = resolveSelectVal(menuConfig, value)
    storeRef.current[activeTab] = limitValue
    setState((d) => {
      d.selectedVal = limitValue
      d.isUnfolded = undefined
      if (!d.visitedTabs.filter((tab) => tab === activeTab).length) {
        d.visitedTabs.push(activeTab)
      }
    })
  }

  const onTabSelect = (tab: string | number) => {
    setState((d) => {
      d.activeTab = Number(tab)
      d.isUnfolded = undefined
      d.selectedVal = storeRef.current[tab]
    })
  }

  const onSaveClick = () => {
    const authLimit = getAllAuthLimitStr(menuConfig, visitedTabs, storeRef.current)
    const authApi = getAllAuthApiStr(menuConfig, authLimit)

    if (props.onSaveClick) {
      props.onSaveClick({
        authApi,
        authLimit,
      })
    }
  }

  const controlCurrTabAll = (type: 'checkAll' | 'removeAl') => {
    setState((d) => {
      const actTabLimit = convertLimitStr(
        flattenTree(menuConfig[activeTab].children || [])
          .map((i) => i.nodePath)
          .toString()
      )
      const currLimit = convertLimitStr(d.selectedVal)
      let resultLimit = ''
      if (type === 'checkAll') {
        resultLimit = Object.keys({ ...currLimit, ...actTabLimit }).toString()
      } else {
        resultLimit = Object.keys(omitBy(currLimit, (__, key) => !!actTabLimit[key])).toString()
      }
      storeRef.current[activeTab] = resultLimit
      d.selectedVal = resultLimit
    })
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
            tooltip: '重置所有Tab权限中未提交的部分',
            tooltipPlacement: 'top',
            onClick: () => {
              initData()
              toast.success('重置成功', '提示')
            },
          },
          {
            type: 'button',
            label: '全选',
            tooltip: '全部选择当前的Tab权限',
            tooltipPlacement: 'top',
            onClick: () => {
              controlCurrTabAll('checkAll')
              toast.success('当前Tab全部选择成功', '提示')
            },
          },
          {
            type: 'button',
            label: '全取消',
            tooltip: '全部取消当前的tab权限',
            tooltipPlacement: 'top',
            onClick: () => {
              controlCurrTabAll('removeAl')
              toast.success('当前Tab全部取消成功', '提示')
            },
          },
        ],
      },
      {
        type: 'action',
        icon: 'fa fa-check text-success',
        actionType: 'close',
        confirmText: saveConfirmText,
        tooltip: '提交',
        tooltipPlacement: 'top',
        onAction: onSaveClick,
      },
      {
        type: 'action',
        icon: 'fa fa-times text-danger',
        actionType: 'close',
        confirmText: !visitedTabs.length ? '' : '关闭将视为您主动放弃本次修改。',
        tooltip: '取消',
        tooltipPlacement: 'top',
        onAction: onCancelClick,
      },
    ],
  }

  return (
    <StyledLimit className={className}>
      <div className="action-btns m-b-md">
        {render ? render('body', buttonsSchema) : <Amis schema={buttonsSchema} />}
      </div>
      <Tabs activeKey={activeTab} mode="line" onSelect={onTabSelect}>
        {resolveLimitMenus(menuConfig, { limitValue: selectedVal }).map(
          (item: any, index: number) => {
            if (!item.children) {
              return null
            }
            return (
              <Tab
                key={index}
                title={item.limitLabel || item.label}
                icon={item.icon}
                eventKey={index}
              >
                {/** @ts-ignore */}
                <TreeSelector
                  key={`${isUnfolded}`}
                  hideRoot
                  multiple
                  joinValues
                  onlyChildren
                  initiallyOpen={isUnfolded}
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
function resolveLimitMenus(menusConfig: any[], option: { limitValue: string }) {
  const { limitValue } = option
  const limits = convertLimitStr(limitValue)

  return mapTree<LimitItem>(menusConfig, (item) => {
    const { needs, nodePath } = item
    // item.unfolded = isUnfolded
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
    if (value && visitedTabs.findIndex((tab) => tab === index) > -1) {
      limitValue.push(value)
      return
    }
    eachTree(menusConfig[index]?.children || [], (item) => {
      const limits = convertLimitStr(value)
      if (item.nodePath && limits[item.nodePath]) {
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
      const { url = '', key, limits: apiLimits } = apiItem
      const auth = !apiLimits ? true : checkLimitByKeys(apiLimits, { nodePath, limits })
      if (auth) {
        authApis[key || url] = true
      }
    })
  })

  const apiValue = Object.keys(authApis).join(',')

  return apiValue
}

export default LimitSetting
