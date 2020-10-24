/**
 * 应用内常量模块
 */

// 用于存储的key
export const storeKeys = {
  auth: 'auth',
  schemaEditor: 'schemaEditor',
}

// 用于消息通知的 key
export const msgKeys = {
  updateAuthLoginCode: 'updateAuthLoginCode',
}

// 权限校验key
export const limitKeys = {
  global: {
    // 全局权限 是根据 app/routes/global 的 nodePath 与 limits 字段 key 拼接而成，其他的权限逻辑类似
    sysRoleIdPicker: '/_global/system/sysRoleIdPicker',
    sysUserInfoModal: '/_global/system/sysUserInfoModal',
  },
}

// 覆盖ovine内部的常量
export const appConstants = {
  loginRoute: '/login',
  enableBackTop: true,
}
