import { mockSource } from './mock'

const apis = {
  list: {
    url: 'GET api/v1/adm_operate_log',
    mockSource: mockSource['GET api/v1/adm_operate_log'],
  },
}

export const schema = {
  type: 'rt-crud',
  api: apis.list,
  filterTogglable: true,
  filter: {
    controls: [
      {
        type: 'text',
        name: 'keywords',
        label: '关键字',
        placeholder: '请输入关键字',
      },
      {
        type: 'select',
        name: 'cat',
        label: '类别',
        placeholder: '请选择类别',
        options: [
          {
            label: 'Option A',
            value: 'a',
          },
          {
            label: 'Option B',
            value: 'b',
          },
        ],
      },
      {
        type: 'submit',
        className: 'm-l',
        label: '搜索',
      },
    ],
  },
  headerToolbar: [
    {
      type: 'filter-toggler',
      align: 'left',
    },
    {
      type: 'columns-toggler',
      align: 'left',
    },
  ],
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  columns: [
    {
      name: 'create_at',
      label: '操作时间',
      type: 'datetime',
      width: 150,
    },
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      width: 40,
      toggled: false,
    },
    {
      name: 'type',
      label: '操作类型',
      type: 'rt-blank',
      width: 80,
    },
    {
      name: 'operate_user',
      label: '操作人员',
      type: 'text',
      sortable: true,
      width: 80,
    },
    {
      name: 'detail',
      label: '操作详情',
      type: 'text',
      sortable: true,
      width: 80,
    },
  ],
}
