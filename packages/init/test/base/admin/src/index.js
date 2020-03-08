import app from '@rtadmin/core/app' 

// app.getConfig
// app.env
// app.request
// app.user
// app.theme

// 初始化
app.create({
  request: new Request(), // 请求实例
  user: new User(), // 用户实例
  theme: new Theme(), // 主题实例
  constants: { // 覆盖内置常量
    loginRoute: '/login',
    notFoundRoute: '/404',
  },
  routes:[{ // 路由配置
    path: '/login',
    withOutAuth: true,
    withOutLimit: true,
    layout: false
  }, {
    path: '/404',
    withOutLimit: true,
  }, {
    path: '/dashboard',
  }],
  amis: { // 开放部分 amis 配置

  },
  env: { // 环境变量
    localhost: {},
    staging: {},
    production: {},
  },
  layout: { // app 布局
    type: 'aside-menu',
    header: {},
    aside: {},
    body: {},
    footer: {},
  }
})