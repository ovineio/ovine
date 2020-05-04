export default {
  limits: {
    $page: {
      label: '查看列表',
    },
    editRole: {
      label: '编辑角色',
    },
    addIRole: {
      label: '添加角色',
      needs: ['editRole'],
    },
    editLimit: {
      label: '编辑权限',
      needs: ['editRole'],
    },
    listMember: {
      label: '角色成员列表',
      needs: ['editRole'],
    },
    editMember: {
      label: '修改角色成员',
      needs: ['listMember'],
    },
    delRole: {
      label: '删除角色',
      needs: ['editRole'],
    },
  },
  apis: {
    list: {
      url: 'GET rtapi/system/role/item',
      limits: '$page',
      mock: true,
    },
    filterRole: {
      url: 'GET rtapi/system/role/filter?filter=$term',
      mock: true,
      sourceKey: 'data.items',
      onSuccess: (source = []) => {
        const options = source.map((i = {}) => {
          return {
            label: `${i.name} (${i.id})`,
            value: i.id,
          }
        })
        return {
          code: 0,
          data: { options },
        }
      },
    },
    addRole: {
      url: 'POST rtapi/system/role/item/$id',
      limits: 'addRole',
      mock: true,
    },
    editRole: {
      url: 'PUT rtapi/system/role/item/$id',
      limits: 'editRole',
      mock: true,
    },
    delRole: {
      url: 'DELETE rtapi/system/role/item/$id',
      limits: 'delRole',
      mock: true,
    },
    getLimit: {
      url: 'GET rtapi/system/role/item/$id/limit',
      limits: 'editLimit',
      mock: true,
    },
    editLimit: {
      url: 'PUT rtapi/system/role/item/$id/limit',
      limits: 'editLimit',
      mock: true,
    },
    listMember: {
      url: 'GET rtapi/system/user/item',
      limits: 'listMember',
      mock: true,
      // data: {
      //   page: '${page}',
      //   size: '${size}',
      // },
    },
    editMember: {
      url: 'PUT rtapi/system/role/member',
      limits: 'editMember',
      mock: true,
      onPreRequest: (source) => {
        const { ids, newRoleId } = source.data
        source.data = {
          userIds: ids.split(',').map((i) => Number(i)),
          roleId: newRoleId,
        }
        return source
      },
    },
  },
}
