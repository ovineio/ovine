import { ActionAddrCell } from './cells'

export const schema = {
  type: 'lib-crud',
  api: '$preset.apis.list',
  filter: '$preset.forms.filter',
  filterTogglable: true,
  headerToolbar: [
    'filter-toggler',
    {
      type: 'columns-toggler',
      align: 'left',
    },
    {
      type: 'pagination',
      align: 'left',
    },
  ],
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  perPageField: 'size',
  pageField: 'page',
  columns: [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
    },
    {
      name: 'createTime',
      label: '操作时间',
      type: 'datetime',
      width: 150,
    },
    {
      name: 'actionAddr',
      label: '操作路径',
      type: 'wrapper',
      component: ActionAddrCell,
    },
    {
      name: 'handlerId',
      label: '操作人ID',
      type: 'text',
      sortable: true,
    },
    {
      name: 'handlerName',
      label: '操作人名称',
      type: 'text',
      sortable: true,
    },
    {
      name: 'result',
      label: '操作结果',
      type: 'tpl',
      tpl: `
        <span>
          <%= data.result == 1 ? "成功" : "失败" %>
          <% if(data.result != 1) { %>
            <span>失败原因: <%= data.failDesc || '' %><span>
          <% } %>
        </span>
      `,
    },
    {
      name: 'detail',
      label: '操作内容',
      type: 'text',
    },
  ],
  preset: {
    forms: {
      filter: {
        controls: [
          {
            type: 'text',
            name: 'keywords',
            label: '关键字',
            placeholder: '请输入账号/昵称',
          },
          {
            type: 'select',
            name: 'cat',
            label: '用户权限',
            placeholder: '请选择权限',
            clearable: true,
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
    },
  },
}
