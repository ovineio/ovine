import mockSource from './mock'

export default {
  limits: {
    $page: {
      label: '查看列表',
    },
    editItem: {
      label: '编辑角色',
    },
    addItem: {
      label: '添加角色',
      needs: ['editItem'],
    },
    editLimit: {
      label: '编辑权限',
      needs: ['editItem'],
    },
    listMember: {
      label: '成员管理',
      needs: ['editItem'],
    },
    removeMember: {
      label: '移除成员',
      needs: ['listMember'],
    },
    addMember: {
      label: '添加成员',
      needs: ['removeMember'],
    },
    delItem: {
      label: '删除角色',
      needs: ['addItem'],
    },
  },
  apis: {
    list: {
      mockSource,
      url: 'GET rtapi/system/limit',
      limits: '$page',
    },
    add: {
      mockSource,
      url: 'POST rtapi/system/limit',
      limits: 'addItem',
    },
    edit: {
      mockSource,
      url: 'PUT rtapi/system/limit/$id',
      limits: 'editItem',
    },
    del: {
      mockSource,
      url: 'DELETE rtapi/system/limit/$id',
      limits: 'delItem',
    },
    listMember: {
      mockSource,
      url: 'GET rtapi/system/limit/$id/member',
      limits: 'listMember',
    },
    addMember: {
      mockSource,
      url: 'POST rtapi/system/limit/$id/member',
      limits: 'addMember',
    },
    removeMember: {
      mockSource,
      url: 'DELETE rtapi/system/limit/$id/member',
      limits: 'removeMember',
    },
  },
}
