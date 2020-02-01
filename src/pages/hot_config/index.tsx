export const schema = {
  type: 'rt-crud',
  api: 'https://houtai.baidu.com/api/sample?waitSeconds=1',
  filterTogglable: true,
  filter: {
    title: '',
    submitText: '',
    wrapWithPanel: false,
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
        className: 'm-l',
        label: '搜索',
      },
    ],
  },
  headerToolbar: [
    {
      type: 'button',
      actionType: 'dialog',
      label: '新增',
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
    {
      type: 'filter-toggler',
      align: 'right',
    },
    {
      type: 'columns-toggler',
      align: 'right',
    },
  ],
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  columns: [
    {
      name: 'id',
      label: 'ID',
      width: 20,
      sortable: true,
      type: 'text',
      toggled: false,
    },
    {
      name: 'key',
      label: '配置KEY',
      sortable: true,
      searchable: true,
      type: 'text',
      toggled: true,
    },
    {
      name: 'cat',
      label: '配置类别',
      sortable: true,
      type: 'text',
      toggled: true,
    },
    {
      name: 'desc',
      label: '描述',
      popOver: {
        body: {
          type: 'tpl',
          tpl: '偏了一点的popover',
        },
        offset: {
          y: 100,
        },
      },
      sortable: true,
      type: 'text',
      toggled: true,
    },
    {
      name: 'token',
      label: '访问TOKEN',
      quickEdit: true,
      type: 'text',
      toggled: true,
      filterable: {
        options: [
          {
            label: '4',
            value: '4',
          },
          {
            label: '5',
            value: '5',
          },
          {
            label: '6',
            value: '6',
          },
        ],
      },
    },
    {
      name: 'ip',
      label: 'IP白名单',
      type: 'text',
      toggled: true,
    },
    {
      name: 'update_at',
      label: '修改时间',
      type: 'text',
      toggled: true,
    },
    {
      name: 'create_at',
      label: '创建时间',
      type: 'text',
      toggled: true,
    },
    {
      type: 'operation',
      label: '操作',
      width: 100,
      toggled: true,
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
          drawer: {
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
