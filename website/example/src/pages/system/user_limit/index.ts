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
      name: 'name',
      label: '角色名',
      type: 'text',
    },
    {
      name: 'desc',
      label: '角色描述',
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
      width: 100,
      buttons: [
        '$preset.actions.members',
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
          name: 'name',
          label: '角色名',
          required: true,
        },
        {
          type: 'text',
          name: 'desc',
          label: '角色描述',
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
        icon: 'fa fa-plus pull-left',
        size: 'sm',
        primary: true,
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      edit: {
        type: 'button',
        label: '编辑',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.edit',
      },
      members: {
        type: 'button',
        label: '成员管理',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.editMember',
      },
      editLimit: {
        type: 'button',
        label: '权限管理',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.editLimit',
      },
      del: {
        type: 'button',
        actionType: 'ajax',
        level: 'link',
        label: '删除',
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
      editMember: {
        title: '角色成员管理',
        size: 'lg',
        bodyClassName: 'p-n',
        actions: [],
        body: {
          type: 'lib-crud',
          affixHeader: true,
          api: '$preset.apis.list',
          filterTogglable: true,
          filter: '$preset.forms.filter',
          headerToolbar: [
            'bulkActions',
            {
              type: 'tpl',
              tpl: '当前有 ${total} 条数据。',
              className: 'v-middle',
            },
            'pagination',
          ],
          footerToolbar: [],
          perPageField: 'size',
          pageField: 'page',
          bulkActions: [
            {
              label: '添加成员',
              actionType: 'dialog',
              dialog: {
                title: '批量编辑',
                name: 'sample-bulk-edit',
                body: {
                  type: 'form',
                  api: 'https://houtai.baidu.com/api/sample/bulkUpdate2',
                  controls: [
                    {
                      type: 'hidden',
                      name: 'ids',
                    },
                    {
                      type: 'text',
                      name: 'engine',
                      label: 'Engine',
                    },
                  ],
                },
              },
            },
            {
              label: '移除成员',
              actionType: 'ajax',
              api: 'delete:https://houtai.baidu.com/api/sample/${ids|raw}',
              confirmText: '确定要批量删除?',
            },
          ],
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
            // {
            //   type: 'operation',
            //   label: '操作',
            //   width: 100,
            //   buttons: [
            //     '$preset.actions.members',
            //     '$preset.actions.edit',
            //     '$preset.actions.editLimit',
            //     '$preset.actions.del',
            //   ],
            // },
          ],
        },
      },
      editLimit: {
        title: '权限管理',
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
