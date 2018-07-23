import { get, includes } from 'lodash';
import { CURRENT } from './index';

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }

  let pathKey = String(authority);
  if (pathKey.indexOf('/') === 0) {
    pathKey = String(pathKey).substr(1, pathKey.length - 1);
  }
  if (pathKey.indexOf('/') > 0) {
    pathKey = String(pathKey).replace(/\//g, '.');
  }

  if (get(currentAuthority, pathKey) || includes(currentAuthority, authority)) {
    return target;
  }
  return Exception;
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
