/**
 * 用户模块
 */

// 用户token
export const getToken = (): string | undefined => {
  return 'asasdasdd'
}

// 是否登录
export const isLogin = (): boolean => {
  return !!getToken()
}

// 检验 token 出错后的操作
export const onUserTokenError = () => {
  //
}

// 用户登出
export const userLogout = () => {
  //
}

// 用户登录
export const userLogin = () => {
  //
}
