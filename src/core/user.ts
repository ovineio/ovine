/**
 * 用户模块
 */

export function getToken(): string | undefined {
  return 'asasdasdd'
}

export function isLogin(): boolean {
  return !!getToken()
}

export function onUserTokenError() {
  //
}
