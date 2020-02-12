/**
 * 全局获取权限
 */

let store: Types.ObjectOf<boolean> = {}

// 将字符串格式的权限数据，转为对象类型，可大大减少权限匹配的时间
export const convertLimitStr = (limitStr: string = '') => {
  const tpl: Types.ObjectOf<boolean> = {}
  const limits = limitStr?.split(',')

  limits?.forEach((key) => {
    tpl[key] = true
  })

  return tpl
}

export const getAppLimits = () => {
  return store
}

export const setAppLimits = (limitVal: string) => {
  store = convertLimitStr(limitVal)
}
