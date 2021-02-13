/**
 * 页面预设值，本文件不要引入模块
 */
import apis from './apis'

export default {
  apis,
  // 页面需要用到的权限定义
  limits: {
    // 路由权限
    $page: {
      label: '查看列表',
    },
    add: {
      label: '添加',
    },
    edit: {
      label: '编辑',
    },
    del: {
      label: '删除',
    },
  },
  // 页面需要用到的 api定义
}
