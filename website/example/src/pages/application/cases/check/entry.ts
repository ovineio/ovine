/**
 * 1. 需要将 index.ts 更名为其他 xxx.ts 名字, 不然可能会出现引用错误
 */

import { promisedTimeout } from '@core/utils/tool'

import preset from './preset'

const schema = {
  type: 'page',
  title: '用于测试异步获取配置',
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
      '$preset.actions.add',
    ],
    footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
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
      {
        type: 'operation',
        label: '操作',
        width: 60,
        limits: ['edit', 'del'],
        limitsLogic: 'or', // 满足 limits列表中 一个权限即可渲染
        buttons: ['$preset.actions.edit', '$preset.actions.del'],
      },
    ],
  },
  definitions: {
    updateControls: {
      controls: [
        {
          name: 'desc',
          required: true,
          label: '配置描述',
          type: 'text',
        },
        {
          name: 'content',
          label: 'JSON配置',
          type: 'json-editor',
        },
      ],
    },
  },
  preset: {
    actions: {
      test: {
        limits: 'edit',
        type: 'button',
        icon: 'fa fa-pencil',
        tooltip: '测试编辑',
        actionType: 'dialog',
        dialog: {
          title: '测试编辑',
          size: 'lg',
          body: {
            type: 'form',
            mode: 'normal',
            initApi: '$preset.apis.test',
            api: '$preset.apis.edit',
            $ref: 'updateControls',
          },
        },
      },
      add: {
        limits: 'add',
        type: 'button',
        align: 'right',
        actionType: 'dialog',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        size: 'sm',
        primary: true,
        dialog: {
          title: '新增配置',
          size: 'lg',
          body: {
            type: 'form',
            api: '$preset.apis.add',
            mode: 'normal',
            $ref: 'updateControls',
          },
        },
      },
      edit: {
        limits: 'edit',
        type: 'button',
        icon: 'fa fa-pencil',
        tooltip: '编辑配置',
        actionType: 'dialog',
        dialog: {
          title: '编辑',
          size: 'lg',
          body: {
            type: 'form',
            mode: 'normal',
            api: '$preset.apis.edit',
            $ref: 'updateControls',
          },
        },
      },
      del: {
        limits: 'del',
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        tooltip: '删除',
        confirmText: '您确认要删除?',
        api: '$preset.apis.del',
        messages: {
          success: '删除成功',
          failed: '删除失败',
        },
      },
    },
    forms: {
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
            className: 'm-l',
            label: '搜索',
          },
        ],
      },
    },
  },
}

/**
 * 此处导出配置到 layout 的 route 配置中引入
 */
export const asyncPageOptions = {
  ...preset, // 需要将权限相关信息 引入此处
  pathToComponent: {
    url: 'fakeApiRequest', // 这里只是模拟接口而已，正常接口 请用 'GET xxx' 搭配 onSuccess，代码逻辑一致
    onFakeRequest: async (source) => {
      await promisedTimeout(200)
      /**
       * 此处可以根据 source.data.xxx 任意组装 schema
       * 只要保证 返回的 source.data.schema 是一个正常的格式即可
       */
      source.data = { schema }

      return source
    },
  },
}
