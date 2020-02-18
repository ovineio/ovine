import { RtSchema } from '~/components/amis/schema/types'

export const schema: RtSchema = {
  type: 'rt-crud',
  api: '$preset.apis.list',
  filter: '$preset.forms.filter',
  filterTogglable: true,
  limits: '$page',
  perPageField: 'size',
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  tableWidth: 1000,
  headerToolbar: [
    { type: 'filter-toggler', align: 'left' },
    { type: 'columns-toggler', align: 'left' },
    { $preset: 'actions.add' },
  ],
  columns: [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      width: 20,
      toggled: false,
    },
    {
      name: 'name',
      label: '名称',
      type: 'text',
      width: 110,
    },
    {
      name: 'cat',
      label: '类别',
      type: 'html',
      html: '<span class="label label-primary">${cat}</span>',
      width: 80,
    },
    {
      name: 'desc',
      label: '描述',
      type: 'html',
      html: '<span class="text-ellipsis" title="${desc}">${desc}</span>',
    },
    {
      name: 'auth',
      label: '用户Token',
      type: 'rt-blank',
      width: 70,
      limits: 'viewToken',
      body: '$preset.actions.viewToken',
    },
    {
      name: 'update_at',
      label: '修改时间',
      type: 'datetime',
      width: 150,
    },
    {
      name: 'create_at',
      label: '创建时间',
      type: 'datetime',
      width: 150,
    },
    {
      type: 'operation',
      label: '操作',
      width: 100,
      limits: ['viewItem', 'editItem', 'delItem'],
      limitsLogic: 'or',
      buttons: [
        { $preset: 'actions.view' },
        { $preset: 'actions.edit' },
        { $preset: 'actions.delete' },
      ],
    },
  ],
  preset: {
    actions: {
      viewToken: {
        type: 'button',
        actionType: 'dialog',
        label: '查看',
        level: 'link',
        dialog: {
          title: '查看Token',
          body: {
            type: 'html',
            html: '${token}',
          },
        },
      },
      view: {
        type: 'button',
        icon: 'fa fa-eye',
        actionType: 'dialog',
        limits: 'viewItem',
        dialog: {
          title: '查看【${name}】',
          body: '$preset.forms.view',
          actions: [],
        },
      },
      add: {
        type: 'button',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        actionType: 'dialog',
        size: 'sm',
        level: 'primary',
        limits: 'addItem',
        dialog: {
          title: '添加一项',
          body: '$preset.forms.add',
        },
      },
      edit: {
        type: 'button',
        icon: 'fa fa-pencil',
        actionType: 'dialog',
        limits: 'editItem',
        dialog: {
          title: '编辑【${name}】',
          body: '$preset.forms.edit',
        },
      },
      delete: {
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        confirmText: '您确认要删除【${name}】?',
        limits: 'delItem',
        api: '$preset.apis.delete',
      },
    },
    forms: {
      filter: {
        type: 'form',
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
            clearable: true,
            options: [
              {
                label: '普通',
                value: '普通',
              },
              {
                label: '一般',
                value: '一般',
              },
              {
                label: '高级',
                value: '高级',
              },
            ],
          },
          {
            type: 'submit',
            label: '搜索',
          },
        ],
      },
      view: {
        type: 'form',
        controls: [
          {
            name: 'id',
            type: 'static',
            label: 'ID',
          },
          {
            name: 'name',
            type: 'static',
            label: '名称',
          },
          {
            name: 'cat',
            type: 'html',
            label: '类别',
            html:
              '<div class="label label-primary" style="line-height:inherit;display: inline-block;">${cat}</div>',
          },
          {
            name: 'desc',
            type: 'static',
            label: '描述',
          },
          {
            name: 'update_at',
            type: 'static-datetime',
            label: '更新时间',
          },
          {
            name: 'create_at',
            type: 'static-datetime',
            label: '创建时间',
          },
        ],
      },
      add: {
        type: 'form',
        name: 'sample-edit-form',
        api: '$preset.apis.add',
        controls: [
          {
            name: 'name',
            type: 'text',
            label: '名称',
            required: true,
          },
          {
            name: 'cat',
            type: 'select',
            label: '类别',
            required: true,
            options: [
              {
                label: '普通',
                value: '普通',
              },
              {
                label: '一般',
                value: '一般',
              },
              {
                label: '高级',
                value: '高级',
              },
            ],
          },
          {
            name: 'desc',
            type: 'textarea',
            label: '描述',
            minRows: 2,
          },
        ],
      },
      edit: {
        type: 'form',
        name: 'sample-edit-form',
        api: '$preset.apis.edit',
        controls: [
          {
            name: 'id',
            type: 'text',
            label: 'ID',
            disabled: true,
            required: true,
          },
          {
            name: 'name',
            type: 'text',
            label: '名称',
            required: true,
          },
          {
            name: 'cat',
            type: 'select',
            label: '类别',
            required: true,
            options: [
              {
                label: '普通',
                value: '普通',
              },
              {
                label: '一般',
                value: '一般',
              },
              {
                label: '高级',
                value: '高级',
              },
            ],
          },
          {
            name: 'desc',
            type: 'textarea',
            label: '描述',
            minRows: 2,
          },
        ],
      },
      editConfig: {
        type: 'form',
        mode: 'normal',
        title: '',
        controls: [
          {
            name: 'content',
            type: 'diff-editor',
            label: '',
            language: 'yaml',
            inputClassName: '',
            options: {
              minimap: {
                enabled: false,
              },
            },
          },
        ],
      },
    },
  },
}
