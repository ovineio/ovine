export const schema = {
  type: 'lib-crud',
  api: '$preset.apis.list',
  filterTogglable: true,
  filter: '$preset.forms.filter',
  headerToolbar: ['filter-toggler', 'columns-toggler', '$preset.actions.add'],
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
      name: 'name',
      label: '角色名',
      type: 'text',
    },
    {
      name: 'desc',
      label: '角色描述',
      type: 'text',
      sortable: true,
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
      width: 100,
      buttons: [
        '$preset.actions.persons',
        '$preset.actions.edit',
        '$preset.actions.editLimit',
        '$preset.actions.del',
      ],
    },
  ],
  definitions: {
    updateControls: {
      controls: [
        {
          type: 'text',
          name: 'username',
          label: '角色名',
          required: true,
        },
        {
          type: 'text',
          name: 'password',
          label: '登录密码',
          requiredOn: 'typeof data.id === "undefined"',
        },
        {
          type: 'text',
          name: 'nickname',
          label: '名称',
          required: true,
        },
        {
          type: 'text',
          name: 'desc',
          label: '描述',
          required: true,
        },
      ],
    },
  },
  preset: {
    actions: {
      add: {
        type: 'button',
        label: '添加',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      persons: {
        type: 'button',
        label: '成员列表',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      edit: {
        type: 'button',
        label: '编辑',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      editLimit: {
        type: 'button',
        label: '编辑权限',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      del: {
        type: 'button',
        label: '删除',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
    },
    forms: {
      filter: {
        controls: [
          {
            type: 'text',
            name: 'keywords',
            label: '关键字',
            placeholder: '请输入账号/昵称',
          },
          {
            type: 'select',
            name: 'cat',
            label: '用户权限',
            placeholder: '请选择权限',
            clearable: true,
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
            className: 'm-l',
            label: '搜索',
          },
        ],
      },
      add: {
        title: '新增',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: '$preset.apis.add',
          $ref: 'updateControls',
        },
      },
      edit: {
        title: '编辑',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: '$preset.apis.edit',
          $ref: 'updateControls',
        },
      },
    },
  },
}
