import * as styled from './styled'

export const getTableFieldColumn = () => {
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
        '2': '<span class=\'label label-info\'>是</span>',
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
      width: 155,
    },
    {
      name: 'updateTime',
      label: '更新时间',
      type: 'datetime',
      width: 155,
    },
  ]

  return columns
}

export const getModelDataTable = () => {
  const advanceQueryForm = {
    type: 'form',
    title: '',
    mode: 'horizontal',
    horizontal: {
      leftFixed: true,
    },
    actions: [
      {
        label: '查看数据',
        type: 'button',
        actionType: 'dialog',
        dialog: {
          title: '数据',
          body: '<pre>${conditions|json:2}</pre>',
        },
      },
    ],
    controls: [
      {
        type: 'condition-builder',
        label: '条件组件',
        name: 'conditions',
        description: '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
        fields: [
          {
            label: '文本',
            type: 'text',
            name: 'text',
          },
          {
            label: '数字',
            type: 'number',
            name: 'number',
          },
          {
            label: '布尔',
            type: 'boolean',
            name: 'boolean',
          },
          {
            label: '选项',
            type: 'select',
            name: 'select',
            options: [
              {
                label: 'A',
                value: 'a',
              },
              {
                label: 'B',
                value: 'b',
              },
              {
                label: 'C',
                value: 'c',
              },
              {
                label: 'D',
                value: 'd',
              },
              {
                label: 'E',
                value: 'e',
              },
            ],
          },
          {
            label: '日期',
            children: [
              {
                label: '日期',
                type: 'date',
                name: 'date',
              },
              {
                label: '时间',
                type: 'time',
                name: 'time',
              },
              {
                label: '日期时间',
                type: 'datetime',
                name: 'datetime',
              },
            ],
          },
        ],
      },
    ],
  }

  const tableSchema = {
    type: 'lib-css',
    css: styled.modelDataListCss,
    body: {
      type: 'lib-crud',
      syncLocation: false,
      api: '$preset.apis.testList',
      filter: {
        controls: [
          {
            type: 'date-range',
            name: 'dateRange',
            label: '创建时间范围',
            format: 'YYYY-MM-DD',
          },
          {
            type: 'submit',
            icon: 'fa fa-search pull-left',
            label: '搜索',
          },
        ],
      },
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
          limits: 'add',
          type: 'action',
          align: 'left',
          actionType: 'dialog',
          tooltip: '刷新数据',
          tooltipPlacement: 'top',
          icon: 'fa fa-refresh',
          iconOnly: true,
        },
        {
          type: 'columns-toggler',
          align: 'left',
        },
        {
          type: 'export-excel',
          align: 'left',
        },
        {
          type: 'action',
          icon: 'fa fa-search pull-left',
          label: '高级查询',
          align: 'left',
          actionType: 'drawer',
          drawer: {
            title: '【$name】高级查询',
            size: 'lg',
            body: advanceQueryForm,
          },
        },
        {
          type: 'action',
          icon: 'fa fa-plus pull-left',
          level: 'primary',
          label: '添加',
          align: 'left',
        },
        {
          type: 'bulkActions',
          align: 'left',
        },
        {
          type: 'statistics',
          className: 'toolbar-divider',
          align: 'left',
        },
        {
          type: 'pagination',
          align: 'left',
        },
        {
          type: 'switch-per-page',
          align: 'left',
        },
      ],
      footerToolbar: [],
      bulkActions: [
        {
          type: 'action',
          icon: 'fa fa-edit pull-left',
          label: '批量修改',
          align: 'left',
        },
        {
          type: 'action',
          icon: 'fa fa-remove text-danger pull-left',
          label: '批量删除',
          align: 'left',
        },
      ],
      columns: [
        {
          name: 'id',
          label: 'ID',
          type: 'text',
          width: 80,
        },
        {
          name: 'desc',
          label: '描述',
          type: 'text',
        },
        {
          name: 'createTime',
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
      ],
    },
  }

  return tableSchema
}
