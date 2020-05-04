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
      url: 'GET rtapi/system/user/item',
      limits: '$page',
    },
    add: {
      url: 'POST rtapi/system/user/item',
      limits: 'addItem',
    },
    edit: {
      url: 'PUT rtapi/system/user/item/$id',
      limits: 'editItem',
    },
    del: {
      url: 'DELETE rtapi/system/user/item/$id',
      limits: 'delItem',
    },
  },
}
