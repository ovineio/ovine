
type AppLayout = {
  type?: string // 'asideMenu'
  header?: any
  footer?: any
}

export type AppConfig = {
  constants?: {
    loginRoute?: string
    notFoundRoute?: string
  }
  amis?: any
  routes: any[]
  env: any
  layout: AppLayout
}

export type AppInstance = {
  env: any
  request: any
  user: any
  theme: any
}