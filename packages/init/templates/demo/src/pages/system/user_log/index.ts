import { ActionAddrCell, getActionAddrData } from './custom'

export const schema = {
  type: 'page',
  body: {
    type: 'lib-crud',
    api: '$preset.apis.list',
    filter: '$preset.forms.filter',
    filterTogglable: true,
    perPageAvailable: [50, 100, 200],
    defaultParams: {
      size: 50,
    },
    perPageField: 'size',
    pageField: 'page',
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
        type: 'lib-renderer',
        renderer: 'sysUserInfoModal',
        userIdKey: 'handlerId',
      },
      {
        name: 'handlerName',
        label: '操作人名称',
        type: 'text',
      },
      {
        name: 'result',
        label: '操作结果',
        type: 'tpl',
        tpl: `
        <span>
          <%= data.result == 1 ? "成功" : "" %>
          <% if(data.result != 1) { %>
            <span>失败原因: <%= data.failDesc || '' %><span>
          <% } %>
        </span>
      `,
      },
      {
        type: 'lib-blank',
        label: '操作内容',
        body: {
          $preset: 'actions.seeDetail',
        },
      },
    ],
  },
  preset: {
    actions: {
      seeDetail: {
        label: '查看详细',
        type: 'button',
        level: 'link',
        actionType: 'dialog',
        dialog: {
          title: '操作详细内容',
          closeOnEsc: true,
          actions: [],
          body: {
            type: 'form',
            mode: 'normal',
            controls: [
              {
                name: 'detail',
                inputClassName: 'line-break-json',
                type: 'static-json',
              },
            ],
          },
        },
      },
    },
    forms: {
      filter: {
        controls: [
          {
            type: 'datetime',
            name: 'startTime',
            label: '开始时间',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          {
            type: 'datetime',
            name: 'endTime',
            label: '结束时间',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          {
            name: 'actionAddr',
            type: 'select',
            label: '操作路径',
            clearable: true,
            searchable: true,
            options: getActionAddrData(true),
          },
          {
            type: 'text',
            name: 'handlerFilter',
            label: '操作人',
            clearable: true,
            placeholder: '请输入',
          },
          {
            type: 'select',
            name: 'status',
            label: '状态',
            inline: true,
            options: [
              {
                label: '请选择',
                value: '',
              },
              {
                label: '成功',
                value: '1',
              },
              {
                label: '失败',
                value: '2',
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
