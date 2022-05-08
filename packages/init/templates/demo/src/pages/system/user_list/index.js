import { mapTree } from 'amis/lib/utils/helper'

export const schema = {
  type: 'page',
  body: {
    type: 'lib-crud',
    api: '$preset.apis.list',
    filter: '$preset.forms.filter',
    filterTogglable: true,
    perPageField: 'size',
    pageField: 'page',
    perPageAvailable: [50, 100, 200],
    defaultParams: {
      size: 50,
    },
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
        $preset: 'actions.tree',
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
        type: 'text',
      },
      {
        name: 'username',
        label: '登录账号',
        type: 'text',
      },
      {
        name: 'nickname',
        label: '名称',
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
        name: 'roleId',
        label: '角色名',
        type: 'tpl',
        tpl: '<%= !data.roleId ? "-" : data.roleName + " (" + data.roleId +")" %>',
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
        name: 'updateTime',
        label: '更新时间',
        type: 'datetime',
        width: 150,
      },
      {
        type: 'operation',
        label: '操作',
        width: 60,
        limits: ['editItem', 'delItem'],
        limitsLogic: 'or',
        buttons: ['$preset.actions.edit', '$preset.actions.del'],
      },
    ],
  },
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
        },
      ],
    },
  },
  preset: {
    actions: {
      add: {
        limits: 'addItem',
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
            api: '$preset.apis.add',
            $ref: 'updateControls',
          },
        },
      },
      tree: {
        limits: 'viewTree',
        type: 'button',
        align: 'right',
        actionType: 'drawer',
        label: '成员关系图',
        icon: 'fa fa-sitemap pull-left',
        size: 'sm',
        primary: true,
        drawer: '$preset.forms.tree',
      },
      edit: {
        limits: 'editItem',
        type: 'button',
        icon: 'fa fa-pencil',
        tooltip: '编辑',
        actionType: 'dialog',
        dialog: {
          title: '编辑',
          body: {
            type: 'form',
            name: 'sample-edit-form',
            api: '$preset.apis.edit',
            $ref: 'updateControls',
          },
        },
      },
      del: {
        limits: 'delItem',
        type: 'button',
        icon: 'fa fa-times text-danger',
        actionType: 'ajax',
        tooltip: '删除',
        confirmText: '您确认要删除?',
        api: '$preset.apis.del',
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
            type: 'text',
            name: 'filter',
            label: '关键字',
            clearable: true,
            placeholder: '请输入',
          },
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
      tree: {
        position: 'bottom',
        size: 'md',
        title: '您创建的管理员关系图',
        actions: [],
        // closeOnOutside: true,
        // className: 'hide-close-button',
        bodyClassName: 'sub-h-full',
        body: {
          type: 'chart',
          className: 'h-full',
          api: {
            $preset: 'apis.treeChart',
            onSuccess: (source) => {
              const chartData = mapTree([source.data], (item) => {
                return {
                  children: item.children,
                  name: item.nickname,
                  value: item.id,
                }
              })

              source.data = {
                tooltip: {
                  trigger: 'item',
                  triggerOn: 'mousemove',
                },
                series: [
                  {
                    type: 'tree',
                    data: chartData,
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                      position: 'left',
                      verticalAlign: 'middle',
                      align: 'right',
                      fontSize: 9,
                    },
                    leaves: {
                      label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left',
                      },
                    },
                    expandAndCollapse: false,
                    animationDuration: 550,
                    animationDurationUpdate: 750,
                  },
                ],
              }
              return source
            },
          },
        },
      },
    },
  },
}
