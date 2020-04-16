const pageLimit = {
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
    editConfig: {
      label: '编辑配置',
    },
    delItem: {
      label: '删除',
      needs: ['viewItem', 'addItem', 'editItem', 'editConfig'],
    },
  },
  apis: {
    list: {
      url: 'GET api/v1/adm_user',
      limits: '$page',
      mock: true,
    },
    add: {
      url: 'POST api/v1/hot_config',
      limits: 'add',
    },
    edit: {
      url: 'PUT api/v1/hot_config/edit/$id',
      limits: 'edit',
    },
    del: {
      url: 'DELETE api/v1/hot_config/$id',
      limits: 'del',
    },
    api: {
      url: 'api/v1/hot_config/api',
      limits: 'api',
    },
  },
}

export default pageLimit
