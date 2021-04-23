/**
 * APP 权限相关工具方法
 */

import isArray from 'lodash/isArray'

import { app } from '@/app'
import logger from '@/utils/logger'
import { isSubStr } from '@/utils/tool'
import * as Types from '@/utils/types'

import { CheckLimitFunc } from '../types'

let store: Types.ObjectOf<boolean> = {}

const log = logger.getLogger('lib:routes:limit:exports')

// 将字符串格式的权限数据，转为对象类型，可大大减少权限匹配的时间
export const convertLimitStr = (limitStr: string = '') => {
  if (limitStr === app.constants.rootLimitFlag) {
    return { [app.constants.rootLimitFlag]: true }
  }

  const tpl: Types.ObjectOf<boolean> = {}
  const limits = limitStr?.split(',')

  limits?.forEach((key) => {
    tpl[key] = true
  })

  return tpl
}

// 处理 onlyChildren 导致的父级不再的问题
function addLimitParent(limits: any[]): string {
  const limitOrigin: any = {}
  const newLimitObj: any = {}
  limits.forEach((item) => {
    limitOrigin[`${item.slice(0, item.lastIndexOf('/'))}`] = 1
    newLimitObj[item] = 1
  })

  Object.keys(limitOrigin).forEach((item) => {
    const limitPath = item.split('/').slice(1, item.length + 1)
    limitPath.forEach((_val: string, i: number) => {
      newLimitObj[`/${limitPath.slice(0, i + 1).join('/')}`] = 1
    })
  })

  // 去重
  const delRepeatLimit = Object.keys(newLimitObj)

  return delRepeatLimit.join(',')
}

export const setAppLimits = (limitStr: string) => {
  store = convertLimitStr(addLimitParent(limitStr.split(',')))
}

export const getAppLimits = () => store

/**
 * 循环调用时一定要, 传 limits 参数
 * @param nodePath 带检查的节点
 * @param limits 权限模版，用检查节点
 */
export const checkLimitByNodePath = (nodePath: string, limits: any = getAppLimits()) => {
  // 不需要校验权限 全部返回 true
  if (app.env.disableLimit || limits[app.constants.rootLimitFlag]) {
    return true
  }
  // 子权限存在，父权限一定存在
  const withAuth =
    limits[nodePath] || Object.keys(limits).some((i) => isSubStr(i, `${nodePath}/`, 0))
  return withAuth
}

/**
 * 校验一组权限
 * @param limitKeys 可以是权限 key,或者 nodePath。当为 key 时，一定要传 option.nodePath
 * @param option nodePath 校验节点。 limits 权限模版，用检查节点
 */
export const checkLimitByKeys: CheckLimitFunc = (limitKeys, option) => {
  if (!limitKeys) {
    return false
  }

  const { nodePath = '', limits } = option || {}
  const thisLimits = limits || getAppLimits()
  const checkAr = typeof limitKeys === 'string' ? [limitKeys] : limitKeys

  if (!isArray(checkAr)) {
    log.warn('limitKeys 必须是字符串，或者字符串数组', limitKeys)
    return false
  }

  return !checkAr?.some((key) => {
    const checkKey = isSubStr(key, '/') ? key : `${nodePath}/${key}`
    return !checkLimitByNodePath(checkKey, thisLimits)
  })
}
