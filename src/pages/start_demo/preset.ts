import { PagePreset } from '~/routes/types'

const pagePrest: PagePreset = {
  limits: {
    $page: {
      label: '查看列表',
    },
    viewItem: {
      label: '查看行',
    },
    viewToken: {
      label: '查看Token',
    },
    editItem: {
      label: '编辑',
    },
    addItem: {
      label: '添加',
      needs: ['editItem'],
    },
    delItem: {
      label: '删除',
      needs: ['addItem'],
    },
  },
  apis: {
    list: {
      url: 'GET api/v1/start_demo',
      limits: '$page',
      mock: true,
    },
    edit: {
      url: 'PUT api/v1/start_demo/$id',
      limits: 'editItem',
      mock: true,
    },
    add: {
      url: 'POST api/v1/start_demo',
      limits: 'addItem',
      mock: true,
    },
    delete: {
      url: 'DELETE api/v1/start_demo/$id',
      limits: 'delItem',
      mock: true,
    },
  },
}

export default pagePrest
