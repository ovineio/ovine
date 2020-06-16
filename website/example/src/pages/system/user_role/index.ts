import { limitKeys } from '~/app/constants'

import members from './members'

export const schema = {
  type: 'page',
  body: {
    type: 'lib-crud',
    api: '$preset.apis.list',
    filter: {
      $preset: 'forms.filter',
      limits: `${limitKeys.global.sysRoleIdPicker}`,
    },
    filterTogglable: true,
    perPageAvailable: [50, 100, 200],
    defaultParams: {
      size: 50,
    },
    perPageField: 'size',
    pageField: 'page',
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
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 80,
        type: 'text',
      },
      {
        name: 'name',
        label: '角色名',
        width: 120,
        type: 'text',
      },
      {
        name: 'desc',
        label: '角色描述',
        type: 'tpl',
        width: 300,
        tpl: '<span class="text-ellipsis" title="${desc}">${desc}</span>',
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
        width: 92,
        limits: ['editRole', 'editLimit', 'delRole'],
        limitsLogic: 'or',
        buttons: ['$preset.actions.edit', '$preset.actions.editLimit', '$preset.actions.del'],
      },
    ],
  },
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
        limits: 'addRole',
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
        icon: 'fa fa-pencil',
        tooltip: '编辑',
        actionType: 'dialog',
        dialog: '$preset.forms.edit',
      },
      editLimit: {
        limits: 'editLimit',
        type: 'lib-limit-setting',
        saveConfirmText: '您正在修改的角色是【$name】，提交后将不可重置，是否确认提交？',
        button: {
          actionType: 'drawer',
          iconOnly: true,
          icon: 'fa fa-unlock-alt',
          level: 'link',
          label: '',
          tooltip: '编辑权限',
        },
        modal: {
          postion: 'right',
          resizable: true,
          className: 'hide-close-button',
        },
        initApi: '$preset.apis.getLimit',
        api: '$preset.apis.editLimit',
      },
      del: {
        limits: 'delRole',
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        tooltip: '删除',
        confirmText: '您确认要删除?',
        api: '$preset.apis.delRole',
        messages: {
          success: '删除成功',
          failed: '删除失败',
        },
      },
    },
    forms: {
      filter: {
        controls: [
          {
            $ref: 'sysRoleIdPicker',
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
