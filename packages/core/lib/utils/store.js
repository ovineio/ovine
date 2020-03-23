/**
 * 项目用到的全局数据存储模块
 * TODO: 添加缓存过期时间
 */
const globalData = {};
export function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function clearStore(key) {
    localStorage.removeItem(key);
}
export function getStore(key) {
    let value = localStorage.getItem(key);
    if (value) {
        value = JSON.parse(value);
    }
    return value;
}
export function setSessionStore(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}
export function getSessionStore(key) {
    let value = sessionStorage.getItem(key);
    if (value) {
        value = JSON.parse(value);
    }
    return value;
}
export function setGlobal(key, value) {
    globalData[key] = value;
}
export function getGlobal(key) {
    const value = globalData[key];
    return value;
}
