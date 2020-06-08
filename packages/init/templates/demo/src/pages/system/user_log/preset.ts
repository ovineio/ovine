/**
 * 页面预设值，本文件不要引入模块
 */

export default {
  // 页面需要用到的权限定义
  limits: {
    // 路由权限
    $page: {
      label: '查看列表',
    },
  },
  apis: {
    list: {
      url: 'GET ovapi/system/log/item',
      limits: '$page',
    },
  },
}
