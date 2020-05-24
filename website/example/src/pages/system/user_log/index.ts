import { map } from 'lodash'

import { strDelimiter } from '@core/constants'
import { getActionAddrMap } from '@core/routes/config'

import { ActionAddrCell } from './cells'

export const schema = {
  type: 'page',
  body: {
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
        type: 'lib-renderer',
        renderer: 'sysUserInfoModal',
        userIdKey: 'handlerId',
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
        type: 'json',
        levelExpand: 0,
      },
    ],
  },
  preset: {
    forms: {
      filter: {
        controls: [
          {
            type: 'datetime',
            name: 'starTtime',
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
            options: map(getActionAddrMap(), (item, value) => {
              return {
                value,
                label: item.label.replace(strDelimiter, ' '),
              }
            }),
          },
          {
            type: 'text',
            name: 'handlerFilter',
            label: '操作人',
            placeholder: '输入操作人ID/名称',
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
