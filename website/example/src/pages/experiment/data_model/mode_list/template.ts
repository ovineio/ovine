import * as utils from './utils'

export const getTableFieldColumn = (type?: string) => {
  const columns: any[] = [
    {
      name: 'name',
      label: '字段名称',
    },
    {
      name: 'isNull',
      label: '是否必填',
      type: 'mapping',
      map: {
        '1': '<span class=\'label label-info\'>否</span>',
        '0': '<span class=\'label label-info\'>是</span>',
      },
    },
    {
      name: 'typeLabel',
      label: '字段类型',
      popOver: {
        body: {
          type: 'tpl',
          tpl: '${typeDesc}',
        },
      },
    },
    {
      name: 'desc',
      label: '字段描述',
    },
    {
      name: 'addTime',
      label: '创建时间',
      type: 'datetime',
      width: type === 'subList' ? 170 : 150,
    },
    {
      name: 'updateTime',
      label: '更新时间',
      type: 'datetime',
      width: type === 'subList' ? 170 : 150,
    },
  ]

  return columns
}

export const getModeList = () => {
  const modeListSchema = {
    type: 'crud',
    name: 'modelTableList',
    className: 'model-list-crud',
    api: {
      $preset: 'apis.listTable',
      onSuccess: utils.onGetTableListSuc,
    },
    loadDataOnce: true,
    footable: true,
    columnsTogglable: false,
    affixHeader: false,
    toolbarClassName: 'd-none',
    columns: [
      {
        type: 'text',
        name: 'name',
        label: '模型名称',
        // body: '$preset.actions.viewTableData',
      },
      {
        name: 'desc',
        label: '模型描述',
        type: 'text',
      },
      {
        name: 'addTime',
        label: '创建时间',
        type: 'datetime',
        width: 150,
      },
      {
        name: 'updateTime',
        label: '更新时间',
        type: 'datetime',
        width: 150,
      },
      {
        name: 'fields',
        label: '字段列表',
        type: 'container',
        breakpoint: '*',
        body: {
          type: 'table',
          columnsTogglable: false,
          footable: true,
          columns: [
            ...getTableFieldColumn('subList'),
            {
              name: 'extra',
              label: '其他信息',
              type: 'container',
              breakpoint: '*',
              body: {
                type: 'tpl',
                className: 'field-extra',
                tpl: `
              <% if (!data.extra.length) {%>
                <span class="text-black-50">暂无其他信息</span>
              <% } else { %>
                <ul>
                  <% for (var i = 0; i< data.extra.length; i++ ) { var item = data.extra[i]; %>
                    <li><label><%= item.label %>: </label><span><%= item.value %></span></li>
                  <%}%>
                </ul>
              <%}%>
              `,
              },
            },
          ],
        },
      },
      {
        type: 'operation',
        label: '操作',
        width: 150,
        limits: ['edit', 'del'],
        limitsLogic: 'or', // 满足 limits列表中 一个权限即可渲染
        buttons: ['$preset.actions.editTable', '$preset.actions.delTable'],
      },
    ],
  }

  return modeListSchema
}
