import limit from './limit'
import members from './members'

export const schema = {
  type: 'page',
  body: {
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
        $preset: 'actions.members',
        align: 'right',
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
        width: 110,
        buttons: ['$preset.actions.edit', '$preset.actions.editLimit', '$preset.actions.del'],
      },
    ],
  },
  definitions: {
    roleAutoComplete: {
      type: 'select',
      name: 'roleIds',
      label: '角色名',
      placeholder: '请选择角色',
      searchPromptText: '输入角色ID/角色名',
      clearable: true,
      multiple: true,
      searchable: true,
      autoComplete: '$preset.apis.filterRole',
    },
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
        limits: 'addIRole',
        type: 'button',
        label: '添加',
        icon: 'fa fa-plus pull-left',
        size: 'sm',
        primary: true,
        actionType: 'dialog',
        dialog: '$preset.forms.add',
      },
      members: {
        limits: 'listMember',
        type: 'button',
        label: '成员管理',
        icon: 'fa fa-users pull-left',
        size: 'sm',
        primary: true,
        actionType: 'dialog',
        dialog: members,
      },
      edit: {
        limits: 'editRole',
        type: 'button',
        label: '编辑',
        level: 'link',
        actionType: 'dialog',
        dialog: '$preset.forms.edit',
      },
      editLimit: {
        limits: 'editLimit',
        type: 'button',
        label: '编辑权限',
        level: 'link',
        actionType: 'dialog',
        dialog: {
          title: '编辑权限',
          size: 'md',
          // showCloseButton: false,
          actions: [],
          body: {
            type: 'service',
            api: '$preset.apis.getLimit',
            body: {
              component: limit,
            },
          },
        },
      },
      del: {
        limits: 'delRole',
        type: 'button',
        actionType: 'ajax',
        level: 'link',
        label: '删除',
        confirmText: '您确认要删除?',
        api: '$preset.apis.delRole',
      },
    },
    forms: {
      filter: {
        controls: [
          {
            $ref: 'roleAutoComplete',
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
          api: '$preset.apis.addRole',
          $ref: 'updateControls',
        },
      },
      edit: {
        title: '编辑',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: '$preset.apis.editRole',
          $ref: 'updateControls',
        },
      },
    },
  },
}
