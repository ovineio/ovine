export default {
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
  apis: {
    filterRole: {
      url: 'GET ovapi/system/role/filter?filter=$term',
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
