import { RtSchema } from '~/components/amis/schema/types'

export const schema: RtSchema = {
  type: 'rt-crud',
  api: '$preset.apis.list',
  filter: '$preset.forms.filter',
  filterTogglable: true,
  limits: '$page',
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  tableWidth: 1000,
  headerToolbar: [
    { type: 'filter-toggler' },
    { type: 'columns-toggler' },
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
      name: 'key',
      label: '配置KEY',
      width: 80,
      type: 'rt-blank',
      body: '$preset.actions.editConfig',
    },
    {
      name: 'cat',
      label: '配置类别',
      type: 'text',
      sortable: true,
      width: 80,
    },
    {
      name: 'desc',
      label: '描述',
      type: 'tpl',
      tpl: '<span class="text-ellipsis" title="${desc}">${desc}</span>',
    },
    {
      name: 'token',
      label: '访问TOKEN',
      type: 'html',
      html: '<span class="text-ellipsis" title="${token}">${token}</span>',
    },
    {
      name: 'ip',
      label: 'IP白名单',
      type: 'rt-blank',
      width: 60,
      body: '$preset.actions.viewIp',
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
      buttons: [
        { $preset: 'actions.view' },
        { $preset: 'actions.edit' },
        { $preset: 'actions.delete' },
      ],
    },
  ],
  preset: {
    actions: {
      view: {
        type: 'button',
        icon: 'fa fa-eye',
        actionType: 'dialog',
        limit: '$preset.limits.viewDetail',
        dialog: {
          title: '查看',
          body: '$preset.forms.view',
        },
      },
      add: {
        type: 'button',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        actionType: 'dialog',
        size: 'sm',
        level: 'primary',
        dialog: {
          title: '新增',
          body: '$preset.forms.add',
        },
      },
      edit: {
        type: 'button',
        icon: 'fa fa-pencil',
        actionType: 'drawer',
        dialog: {
          position: 'left',
          size: 'lg',
          title: '编辑',
          body: '$preset.forms.edit',
        },
      },
      delete: {
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        confirmText: '您确认要删除?',
        api: '$preset.apis.delete',
      },
      editConfig: {
        type: 'button',
        actionType: 'dialog',
        label: '${key}',
        level: 'link',
        dialog: {
          title: '编辑配置: ${cat}/${key}',
          size: 'lg',
          bodyClassName: 'p-b-none',
          body: '$preset.forms.editConfig',
        },
      },
      viewIp: {
        type: 'button',
        actionType: 'dialog',
        label: '查看',
        level: 'link',
        dialog: {
          title: 'IP白名单',
          body: {
            type: 'tpl',
            tpl: '${ip}',
          },
        },
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
            label: '搜索',
          },
        ],
      },
      view: {
        type: 'form',
        controls: [
          {
            type: 'static',
            name: 'engine',
            label: 'Engine',
          },
          {
            type: 'divider',
          },
          {
            type: 'static',
            name: 'browser',
            label: 'Browser',
          },
          {
            type: 'divider',
          },
          {
            type: 'static',
            name: 'platform',
            label: 'Platform(s)',
          },
          {
            type: 'divider',
          },
          {
            type: 'static',
            name: 'version',
            label: 'Engine version',
          },
          {
            type: 'divider',
          },
          {
            type: 'static',
            name: 'grade',
            label: 'CSS grade',
          },
          {
            type: 'divider',
          },
          {
            type: 'html',
            html: '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>',
          },
        ],
      },
      add: {
        type: 'form',
        name: 'sample-edit-form',
        api: '$preset.apis.add',
        controls: [
          {
            type: 'text',
            name: 'engine',
            label: 'Engine',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'browser',
            label: 'Browser',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'platform',
            label: 'Platform(s)',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'version',
            label: 'Engine version',
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'grade',
            label: 'CSS grade',
          },
        ],
      },
      edit: {
        type: 'form',
        name: 'sample-edit-form',
        api: '$preset.apis.edit',
        controls: [
          {
            type: 'text',
            name: 'engine',
            label: 'Engine',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'browser',
            label: 'Browser',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'platform',
            label: 'Platform(s)',
            required: true,
          },
          {
            type: 'divider',
          },
          {
            type: 'text',
            name: 'version',
            label: 'Engine version',
          },
          {
            type: 'divider',
          },
          {
            type: 'select',
            name: 'grade',
            label: 'CSS grade',
            options: ['A', 'B', 'C', 'D', 'X'],
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
