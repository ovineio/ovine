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
  apis: {
    list: {
      url: 'GET ovapi/hot_config/item',
      limits: '$page',
      onPreRequest: (source) => {
        const { dateRange } = source.data
        if (dateRange) {
          const arr = dateRange.split('%2C')
          source.data = {
            ...source.data,
            startDate: arr[0],
            endDate: arr[1],
          }
        }
        return source
      },
    },
    add: {
      url: 'POST ovapi/hot_config/item',
      limits: 'add',
    },
    edit: {
      url: 'PUT ovapi/hot_config/item/$id',
      limits: 'edit',
    },
    del: {
      url: 'DELETE ovapi/hot_config/item/$id',
      limits: 'del',
    },
  },
}
