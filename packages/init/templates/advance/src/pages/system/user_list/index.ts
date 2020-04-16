export const schema = {
  type: 'lib-crud',
  api: '$preset.apis.list',
  filterTogglable: true,
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
  headerToolbar: [
    {
      type: 'filter-toggler',
    },
    {
      type: 'columns-toggler',
    },
    {
      type: 'button',
      align: 'right',
      actionType: 'dialog',
      label: '添加',
      icon: 'fa fa-plus pull-left',
      size: 'sm',
      primary: true,
      dialog: {
        title: '新增',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: 'post:https://houtai.baidu.com/api/sample',
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
      },
    },
  ],
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
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
      name: 'nick_name',
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
      name: 'limit',
      label: '用户权限',
      type: 'text',
      // quickEdit: {
      //   mode: 'inline',
      //   type: 'select',
      //   inputClassName: 'w-xs',
      //   options: ['A', 'B', 'C', 'D', 'X'],
      //   saveImmediately: true,
      // },
    },
    {
      name: 'desc',
      label: '用户描述',
      type: 'tpl',
      tpl: '<span class="text-ellipsis" title="${desc}">${desc}</span>',
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
        {
          type: 'button',
          icon: 'fa fa-eye',
          actionType: 'dialog',
          tooltip: '查看',
          dialog: {
            title: '查看',
            body: {
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
          },
        },
        {
          type: 'button',
          icon: 'fa fa-pencil',
          tooltip: '编辑',
          actionType: 'drawer',
          dialog: {
            position: 'left',
            size: 'lg',
            title: '编辑',
            body: {
              type: 'form',
              name: 'sample-edit-form',
              api: 'https://houtai.baidu.com/api/sample/$id',
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
        {
          type: 'button',
          icon: 'fa fa-times text-danger',
          actionType: 'ajax',
          tooltip: '删除',
          confirmText: '您确认要删除?',
          api: 'delete:https://houtai.baidu.com/api/sample/$id',
        },
      ],
    },
  ],
}
