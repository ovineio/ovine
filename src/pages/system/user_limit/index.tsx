import { RtSchema } from '~/widgets/amis/schema/utils'
import LimitSetting from '~/widgets/limit_setting'

export const schema: RtSchema = {
  type: 'rt-crud',
  api: '$preset.apis.list',
  filter: '$preset.forms.filter',
  filterTogglable: true,
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
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
      name: 'name',
      label: '名称',
      width: 80,
      type: 'text',
    },
    {
      name: 'remark',
      label: '描述',
      type: 'html',
      html: '<span class="text-ellipsis" title="${remark}">${remark}</span>',
    },
    {
      name: 'users',
      label: '成员列表',
      type: 'rt-when',
      condition: '!!data.users',
      ifTrue: '$preset.actions.viewUsers',
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
      width: 130,
      buttons: [
        { $preset: 'actions.edit' },
        { $preset: 'actions.editLimit' },
        { $preset: 'actions.delete' },
      ],
    },
  ],
  preset: {
    actions: {
      add: {
        type: 'button',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        size: 'sm',
        primary: true,
        actionType: 'dialog',
        limits: 'add',
        dialog: {
          title: '新增',
          body: '$preset.forms.add',
        },
      },
      edit: {
        type: 'button',
        label: '编辑',
        actionType: 'drawer',
        level: 'link',
        size: 'md',
        dialog: {
          position: 'left',
          size: 'lg',
          title: '编辑',
          body: '$preset.forms.edit',
        },
      },
      editLimit: {
        type: 'button',
        actionType: 'dialog',
        label: '设置权限',
        level: 'link',
        size: 'md',
        dialog: {
          title: '设置权限 > ${name}',
          size: 'md',
          body: {
            component: LimitSetting,
          },
          actions: [],
        },
      },
      delete: {
        type: 'button',
        level: 'link',
        actionType: 'ajax',
        label: '删除',
        size: 'md',
        confirmText: '您确认要删除?',
        api: '$preset.apis.delete',
      },
      viewUsers: {
        type: 'button',
        actionType: 'dialog',
        label: '查看',
        level: 'link',
        dialog: {
          title: '成员列表 > ${name}',
          body: {
            type: 'tpl',
            tpl: '${users}',
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
            type: 'submit',
            className: 'm-l',
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
    },
  },
}
