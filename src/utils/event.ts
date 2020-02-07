/**
 * 实现消息通知逻辑
 * 解耦组件状态依赖
 */

import isArray from 'lodash/isArray'
import isNone from 'lodash/isUndefined'

type Key = string | string[]
type Handler<T = any> = (data: T) => void

export const observer: Types.ObjectOf<Handler[]> = {}
export const source: Types.ObjectOf<any> = {}

const $store = '$store'

const storeKeyCtrl: Types.ValueCtrl<string> = (type, value = '') => {
  if (type === 'get') {
    if (value.indexOf(`${$store}/`) === 0) {
      return value.split(`${$store}/`)[1]
    }
    return
  }

  if (type === 'set') {
    return `${$store}/${value}`
  }
}

export const store = () => {
  return new Proxy(
    {},
    {
      get(_, key: string) {
        return source[key]
      },
      // 整个模块的核心逻辑
      // 代理object赋值操作，设置值的时候，触发订阅时的回调函数
      set(_, key: string, value) {
        // 只有值变化 才触发回调。
        if (!(source[key] && source[key] === value)) {
          source[key] = value

          const storeKey = storeKeyCtrl('set', key) || ''

          if (!isNone(observer[storeKey])) {
            observer[storeKey].forEach((handler) => {
              handler(value)
            })
          }
        }
        return true
      },
    }
  )
}

// 消息订阅
export const on = (key: Key, handler: Handler) => {
  const cacheObserverHandlers = (mapKey: string) => {
    if (isNone(observer[mapKey])) {
      observer[mapKey] = []
    }

    observer[mapKey].push(handler)

    const handlerKey = storeKeyCtrl('get', mapKey)
    if (handlerKey && !isNone(source[handlerKey])) {
      handler(source[handlerKey])
    }
  }

  const listener = {
    key,
    off: () => {
      //
    },
  }

  if (isArray(key)) {
    key.forEach(cacheObserverHandlers)
    listener.off = () => key.forEach((k) => off(k, handler))
    //
  } else {
    cacheObserverHandlers(key)
    listener.off = () => off(key, handler)
  }

  return listener
}

// 发送消息
export const emit = <T>(key: Key, value: T) => {
  const keyToObserver = (obsKey: string) => {
    const sourceKey = storeKeyCtrl('get', obsKey)
    if (sourceKey && !isNone(source[sourceKey])) {
      source[sourceKey] = value
    }

    if (!isNone(source[obsKey])) {
      observer[obsKey].forEach((handler: Handler<T>) => {
        handler(value)
      })
    }
  }

  if (isArray(key)) {
    key.forEach(keyToObserver)
  } else {
    keyToObserver(key)
  }
}

// 订阅一次，就销毁
export const once = <T>(key: string, handler: Handler) => {
  const listener = on(key, (data: T) => {
    handler(data)
    listener.off()
  })
}

// 取消订阅
export const off = (key: Key, handler: Handler) => {
  const offObserver = (offKey: string) => {
    if (!isNone(observer[offKey])) {
      observer[offKey].forEach((obsHandler: Handler, index) => {
        if (obsHandler === handler) {
          observer[offKey].splice(index, 1)
        }
      })
    }
  }

  if (isArray(key)) {
    key.forEach(offObserver)
  } else {
    offObserver(key)
  }
}
