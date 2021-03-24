import { resolveLibSchema } from '@core/components/amis/schema/func'
import { promisedTimeout } from '@core/utils/tool'

import { apis } from '~/app/common/apis'

import preset from './preset'

const pageSchema = {
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
      name: 'title',
      label: '标题',
      type: 'text',
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
      limitsLogic: 'or',
      buttons: ['$preset.actions.edit', '$preset.actions.del'],
    },
  ],
  definitions: {
    updateControls: {
      controls: [
        {
          name: 'title',
          label: '标题',
          type: 'text',
          required: true,
        },
        {
          name: 'desc',
          label: '描述',
          type: 'text',
        },
        {
          name: 'content',
          label: '文档',
          type: 'rich-text',
          receiver: apis.uploadImg,
        },
      ],
    },
  },
  preset: {
    actions: {
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
          title: '新增文档',
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
        tooltip: '编辑',
        actionType: 'dialog',
        dialog: {
          title: '编辑文档',
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
        type: 'action',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        tooltip: '删除',
        confirmText: '您确认要删除?',
        api: {
          $preset: 'apis.del',
        },
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

export const schema = {
  type: 'page',
  title: '使用 service 渲染器 异步获取 page 配置',
  body: {
    type: 'service',
    schemaApi: {
      url: 'fakeApi', // 这里只是模拟接口而已，正常接口 请用 'GET xxx' 搭配 onSuccess，代码逻辑一致
      onFakeRequest: async (source) => {
        await promisedTimeout(200)

        // 需要手动将 preset.ts 注入到 schema.preset 中
        pageSchema.preset = {
          ...pageSchema,
          ...preset,
        } as any

        /**
         * 此处可以根据 source.data.xxx 任意组装 schema
         * 只要保证 返回的 source.data 是一个正常的 可渲染格式即可, 注意不是 source.data.schema
         */
        source.data = resolveLibSchema(pageSchema as any)

        return source
      },
    },
  },
}
