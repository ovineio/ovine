/**
 * 实现消息通知逻辑
 * 解耦组件状态依赖
 */
import isArray from 'lodash/isArray';
import isNone from 'lodash/isUndefined';
import { message } from "../constants";
const { storeRoot } = message;
const observer = {};
const source = {};
// 格式化存储 key 格式
const storeKeyCtrl = (type, value = '') => {
    const isStoreKey = value.indexOf(storeRoot) === 0;
    if (type === 'set') {
        return isStoreKey ? value : `${storeRoot}${value}`;
    }
    return !isStoreKey ? undefined : value.split(storeRoot)[1];
};
// 更改 store 值,就会自动 publish 消息
export const store = new Proxy({}, {
    get(_, key) {
        return source[key];
    },
    // 整个模块的核心逻辑
    // 代理object赋值操作，设置值的时候，触发订阅时的回调函数
    set(obj, key, value) {
        // 只有值变化 才触发回调。
        if (!(source[key] && source[key] === value)) {
            // eslint-disable-next-line
            obj[key] = value;
            const storeKey = storeKeyCtrl('set', key);
            if (storeKey && !isNone(observer[storeKey])) {
                observer[storeKey].forEach((handler) => {
                    handler(value, storeKey);
                });
            }
        }
        return true;
    },
});
// 发送消息
export const publish = (key, value) => {
    const keyToObserver = (obsKey) => {
        const sourceKey = storeKeyCtrl('get', obsKey);
        if (sourceKey && !isNone(source[sourceKey])) {
            source[sourceKey] = value;
        }
        if (!isNone(observer[obsKey])) {
            observer[obsKey].forEach((handler) => {
                handler(value, obsKey);
            });
        }
    };
    if (isArray(key)) {
        key.forEach(keyToObserver);
    }
    else {
        keyToObserver(key);
    }
};
// 取消订阅
export const unsubscribe = (key, handler) => {
    const offObserver = (offKey) => {
        if (!isNone(observer[offKey])) {
            observer[offKey].forEach((obsHandler, index) => {
                if (obsHandler === handler) {
                    observer[offKey].splice(index, 1);
                }
            });
        }
    };
    if (isArray(key)) {
        key.forEach(offObserver);
    }
    else {
        offObserver(key);
    }
};
// 消息订阅
export const subscribe = (key, handler) => {
    const cacheObserverHandlers = (mapKey) => {
        if (isNone(observer[mapKey])) {
            observer[mapKey] = [];
        }
        observer[mapKey].push(handler);
        const handlerKey = storeKeyCtrl('get', mapKey);
        if (handlerKey && !isNone(source[handlerKey])) {
            handler(source[handlerKey], handlerKey);
        }
    };
    const listener = {
        key,
        unsubscribe: () => {
            //
        },
    };
    if (isArray(key)) {
        key.forEach(cacheObserverHandlers);
        listener.unsubscribe = () => key.forEach((k) => unsubscribe(k, handler));
        //
    }
    else {
        cacheObserverHandlers(key);
        listener.unsubscribe = () => unsubscribe(key, handler);
    }
    return listener;
};
// 订阅一次，就销毁
export const subscribeOnce = (key, handler) => {
    const listener = subscribe(key, (data) => {
        handler(data, key);
        listener.unsubscribe();
    });
};
