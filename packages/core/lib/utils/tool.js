var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { isArray, isObject, map, random, isFunction } from 'lodash';
import { createElement } from 'react';
/**
 * 模版替换字符串 {}
 * @param template String 待替换字符串
 * @param data Object 数据对象
 */
export const templateReplace = (template, data) => {
    const replaceTplReg = /\{(\w*[:]*[=]*\w+)\}(?!})/g;
    return template.replace(replaceTplReg, (...args) => {
        return data[args[1]] || '';
    });
};
/**
 * 日期格式化字符串
 * @param formatter String  模版字符串
 * @param dateString? String 日期字符串
 */
export const formatDate = (formatter, date) => {
    const dateObj = !date ? new Date() : date instanceof Date ? date : new Date(date);
    const transObj = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'h+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        S: dateObj.getMilliseconds(),
    };
    let fmt = formatter;
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${dateObj.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const k in transObj) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? transObj[k] : `00${transObj[k]}`.substr(`${transObj[k]}`.length));
        }
    }
    return fmt;
};
/**
 * 从数组中随机抽取一个
 * @param source 参数数组
 */
export const choice = (source) => {
    return source[random(source.length)];
};
// 校验是否过期
export function isExpired(expiredTime, baseTime = Date.now()) {
    if (!expiredTime) {
        return true;
    }
    return baseTime - Number(new Date(expiredTime).valueOf()) > 0;
}
export function getQuery(key, url) {
    let str = url || window.location.href;
    str = str.indexOf('?') === -1 ? '' : str.split('?')[1];
    const items = str.split('&');
    const result = {};
    items.forEach((v) => {
        const [queryKey, queryVal] = v.split('=');
        result[queryKey] = queryVal;
    });
    if (key) {
        return result[key] || undefined;
    }
    return result;
}
/**
 * 重试异步操作, 主要用于网络异常，导致文件找不到报错 load chunk error
 * @param promiseFn 需要异步操作部分
 * @param retriesLeft 最多尝试的次数, 默认5次
 * @param interval 重试间隔，默认间隔1.5秒
 */
export function retryPromise(promiseFn, retriesLeft = 5, interval = 1500) {
    return new Promise((resolve, reject) => {
        promiseFn()
            .then(resolve)
            .catch((error) => {
            setTimeout(() => {
                if (retriesLeft === 1) {
                    reject(error);
                    return;
                }
                retryPromise(promiseFn, retriesLeft - 1, interval).then(resolve, reject);
            }, interval);
        });
    });
}
/**
 * 是否是子串
 * @param source 模版字符串
 * @param check 待检验字符串
 * @param pos 需要校验的子串位置
 */
export function isSubStr(source, check, pos) {
    if (typeof source !== 'string') {
        return false;
    }
    const index = source.indexOf(check);
    return typeof pos === 'undefined' ? index > -1 : index === pos;
}
// classnames 简单版，足够用了
export function cls(...args) {
    let str = '';
    args.forEach((arg) => {
        if (typeof arg === 'string') {
            str += ` ${arg}`;
        }
        else if (isArray(arg)) {
            arg.forEach((i) => {
                if (typeof i === 'string') {
                    str += ` ${i}`;
                }
            });
        }
        else if (isObject(arg)) {
            map(arg, (val, key) => {
                if (val) {
                    str += ` ${key}`;
                }
            });
        }
    });
    return str;
}
// 更改 dom class 类似 Jq addClass removeClass
export function changeDomCls($dom, type, clsName = '') {
    if (!$dom) {
        return;
    }
    const clsAr = clsName.split(' ');
    const domClsAr = $dom.className.split(' ');
    if (!domClsAr.length) {
        $dom.className = type === 'add' ? clsName : '';
    }
    const result = [];
    if (type === 'add') {
        clsAr.forEach((clsStr) => {
            if (!domClsAr.includes(clsStr)) {
                result.push(clsStr);
            }
        });
    }
    if (type === 'remove') {
        domClsAr.forEach((clsStr) => {
            if (!domClsAr.includes(clsStr)) {
                result.push(clsStr);
            }
        });
    }
    $dom.className = result.join(' ');
}
export function timeout(ms) {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            resolve();
        }, ms);
    });
}
// json渲染React组件
export function json2reactFactory(mapper) {
    return function j2r(schema) {
        if (schema === null) {
            return null;
        }
        if (typeof schema === 'string' || typeof schema === 'number') {
            return schema;
        }
        const { type: schemaType, children } = schema, props = __rest(schema, ["type", "children"]);
        const hasSchemaType = schemaType && typeof schemaType === 'string' && schemaType.trim() !== '';
        if (!hasSchemaType) {
            throw new Error('schema.type must be a non-empty string');
        }
        const componentChildren = children && [].concat(children).map(j2r.bind(null));
        const componentType = isFunction(mapper) ? mapper(schemaType, props) : mapper[schemaType];
        const createArgs = [componentType || schemaType, props].concat(componentChildren);
        return createElement.apply(createElement, createArgs);
    };
}
