export function getToken(): string | undefined {
  return ''
}

export function isLogin(): boolean {
  return !!getToken()
}
