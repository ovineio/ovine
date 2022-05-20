import { emptyListHolder } from '~/app/constants'

import { ActionAddrCell, getActionAddrData } from './custom'

export const schema = {
  type: 'page',
  body: {
    type: 'lib-crud',
    api: '$preset.apis.list',
    filter: '$preset.forms.filter',
    filterTogglable: true,
    perPageAvailable: [50, 100, 200],
    perPage: 50,
    defaultParams: {
      size: 50,
    },
    perPageField: 'size',
    pageField: 'page',
    placeholder: emptyListHolder,
    autoFillHeight: true,
    headerToolbar: [
      'filter-toggler',
      {
        type: 'columns-toggler',
        align: 'left',
      },
      // {
      //   type: 'pagination',
      //   align: 'left',
      // },
    ],
    footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        // groupName: '测试组1',
      },
      {
        name: 'createTime',
        label: '操作时间',
        type: 'datetime',
        width: 150,
        // groupName: '测试组1',
      },
      {
        name: 'actionAddr',
        label: '操作路径',
        type: 'wrapper',
        component: ActionAddrCell,
        // groupName: '测试组2',
      },
      {
        name: 'handlerId',
        label: '操作人ID',
        type: 'lib-renderer',
        renderer: 'sysUserInfoModal',
        userIdKey: 'handlerId',
        // groupName: '测试组2',
      },
      {
        name: 'handlerName',
        label: '操作人名称',
        type: 'text',
        // groupName: '测试组3',
      },
      {
        name: 'result',
        label: '操作结果',
        // groupName: '测试组3',
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
        // groupName: '测试组3',
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
            label: '起止时间',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          {
            type: 'datetime',
            name: 'endTime',
            label: '-',
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
