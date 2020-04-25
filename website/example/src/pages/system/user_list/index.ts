export const schema = {
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
    {
      $preset: 'actions.add',
      align: 'right',
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
      name: 'username',
      label: '登录账号',
      type: 'text',
    },
    {
      name: 'nickname',
      label: '昵称',
      type: 'text',
      sortable: true,
    },
    {
      name: 'avatar',
      label: '头像',
      type: 'tpl',
      tpl: '<img style="width:30px;" src="${avatar}" />',
      popOver: {
        body: '<div class="w-xxl"><img class="w-full" src="${avatar}"/></div>',
      },
    },
    {
      name: 'limitName',
      label: '用户权限',
      type: 'text',
    },
    {
      name: 'desc',
      label: '用户描述',
      type: 'tpl',
      tpl: '<span class="text-ellipsis" title="${desc}">${desc}</span>',
      width: 150,
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'datetime',
      width: 150,
    },
    {
      type: 'operation',
      label: '操作',
      width: 100,
      buttons: ['$preset.actions.edit', '$preset.actions.del'],
    },
  ],
  definitions: {
    updateControls: {
      controls: [
        {
          type: 'text',
          name: 'username',
          label: '登录账号',
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
        align: 'right',
        actionType: 'dialog',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        size: 'sm',
        primary: true,
        dialog: '$preset.forms.add',
      },
      edit: {
        type: 'button',
        icon: 'fa fa-pencil',
        tooltip: '编辑',
        actionType: 'dialog',
        dialog: '$preset.forms.edit',
      },
      del: {
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        tooltip: '删除',
        confirmText: '您确认要删除?',
        api: '$preset.apis.del',
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
