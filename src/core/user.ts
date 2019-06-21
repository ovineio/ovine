export function getToken(): string | undefined {
  return 'asasdasdd'
}

export function isLogin(): boolean {
  return !!getToken()
}
