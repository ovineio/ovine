/**
 * 应用内常量模块
 */

export const storeKeys = {
  auth: 'auth',
  schemaEditor: 'schemaEditor',
}

export const msgKeys = {
  updateAuthLoginCode: 'updateAuthLoginCode',
}

export const appConstants = {
  loginRoute: '/login',
  actionAddrMap: {
    'POST ovapi/user/login': '管理员登录系统',
    'POST ovapi/user/logout': '管理员退出系统',
  },
}
