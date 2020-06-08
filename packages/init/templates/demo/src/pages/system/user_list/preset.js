/**
 * 页面预设值，本文件不要引入模块
 */

export default {
  // 页面需要用到的权限定义
  limits: {
    $page: {
      label: '查看列表',
    },
    viewTree: {
      label: '查看关系图',
    },
    addItem: {
      label: '添加',
    },
    editItem: {
      label: '编辑',
    },
    delItem: {
      label: '删除',
      needs: ['viewTree', 'addItem', 'editItem'],
    },
  },
  // 页面需要用到的 api定义
  apis: {
    list: {
      url: 'GET ovapi/system/user/item',
      limits: '$page',
    },
    add: {
      url: 'POST ovapi/system/user/item',
      limits: 'addItem',
    },
    edit: {
      url: 'PUT ovapi/system/user/item/$id',
      limits: 'editItem',
    },
    del: {
      url: 'DELETE ovapi/system/user/item/$id',
      limits: 'delItem',
    },
    treeChart: {
      url: 'GET ovapi/system/user/tree',
      limits: 'viewTree',
    },
  },
}
