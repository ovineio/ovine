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
  const tpl: Types.ObjectOf<boolean> = {}
  const limits = limitStr?.split(',')

  limits?.forEach((key) => {
    tpl[key] = true
  })

  return tpl
}

export const setAppLimits = (limitStr: string) => {
  store = convertLimitStr(limitStr)
}

export const getAppLimits = () => store

/**
 * 循环调用时一定要, 传 limits 参数
 * @param nodePath 带检查的节点
 * @param limits 权限模版，用检查节点
 */
export const checkLimitByNodePath = (nodePath: string, limits: any = getAppLimits()) => {
  if (app.env.disableLimit) {
    return true
  }
  // 子权限存在，父权限一定存在
  return limits[nodePath] || Object.keys(limits).some((i) => isSubStr(i, `${nodePath}/`, 0))
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
    log.warn('checkLimitByKeys limitKeys 必须是字符串', limitKeys)
    return false
  }

  return !checkAr?.some((key) => {
    const checkKey = isSubStr(key, '/') ? key : `${nodePath}/${key}`
    return !checkLimitByNodePath(checkKey, thisLimits)
  })
}
