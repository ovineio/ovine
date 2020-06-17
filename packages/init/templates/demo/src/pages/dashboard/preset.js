/**
 * 页面预设值，本文件不要引入模块
 */

const prest = {
  // 页面需要用到的权限定义
  limits: {
    // 路由权限
    $page: {
      label: '访问Dashboard',
    },
  },
  apis: {
    chart: {
      url: 'GET ovapi/stat/data',
      cache: 500,
      limits: '$page',
    },
  },
}

export default prest
