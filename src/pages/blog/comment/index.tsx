import { mockSource } from './mock'

const apis = {
  list: {
    url: 'GET api/v1/adm_user',
    mockSource: mockSource['GET api/v1/adm_user'],
  },
  add: {
    url: 'POST api/v1/adm_user',
  },
  edit: {
    url: 'PUT api/v1/adm_user/edit/$id',
  },
  del: {
    url: 'DELETE api/v1/adm_user/$id',
  },
  catList: {
    url: 'api/v1/adm_user/cat',
  },
  api: {
    url: 'api/v1/adm_user/api',
  },
}

export const schema = {
  type: 'rt-crud',
  api: apis.list,
  filterTogglable: true,
  filter: {
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
      type: 'filter-toggler',
    },
    {
      type: 'columns-toggler',
    },
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
  ],
  footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
  columns: [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      width: 40,
    },
    {
      name: 'username',
      label: '登录账号',
      type: 'rt-blank',
      width: 80,
      body: {
        type: 'button',
        actionType: 'dialog',
        label: '${key}',
        level: 'link',
        dialog: {
          title: '编辑配置: ${cat}/${key}',
          size: 'lg',
          bodyClassName: 'p-b-none',
          body: {
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
    },
    {
      name: 'nick_name',
      label: '昵称',
      type: 'text',
      sortable: true,
      width: 80,
    },
    {
      name: 'avatar',
      label: '头像',
      type: 'text',
      sortable: true,
      width: 80,
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
