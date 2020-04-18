import mockSource from './mock'

export default {
  limits: {
    $page: {
      label: '查看列表',
    },
    viewItem: {
      label: '列表详细',
    },
    addItem: {
      label: '添加',
    },
    editItem: {
      label: '编辑',
    },
    editMembers: {
      label: '管理成员',
    },
    editLimit: {
      label: '管理权限',
    },
    delItem: {
      label: '删除',
      needs: ['viewItem', 'addItem', 'editItem'],
    },
  },
  apis: {
    list: {
      mockSource,
      url: 'GET rtapi/system/user',
      limits: '$page',
    },
    add: {
      mockSource,
      url: 'POST rtapi/system/user',
      limits: 'addItem',
    },
    edit: {
      mockSource,
      url: 'PUT rtapi/system/user/$id',
      limits: 'editItem',
    },
    del: {
      mockSource,
      url: 'DELETE rtapi/system/user/$id',
      limits: 'delItem',
    },
  },
}
