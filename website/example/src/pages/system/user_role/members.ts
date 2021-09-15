const members = {
  title: '成员管理',
  size: 'lg',
  actions: [],
  data: {
    id: '',
  },
  body: {
    type: 'lib-crud',
    api: '$preset.apis.listMember',
    filterTogglable: false,
    affixHeader: false,
    syncLocation: false,
    forceReload: true,
    perPageField: 'size',
    pageField: 'page',
    defaultParams: {
      page: 1,
      size: 10,
    },
    labelTpl: '${nickname}',
    headerToolbar: ['bulkActions'],
    footerToolbar: [
      {
        type: 'tpl',
        tpl: '当前有 ${total || "0"} 条数据。',
        className: 'v-middle',
      },
      'pagination',
    ],
    filter: {
      controls: [
        {
          type: 'text',
          name: 'filter',
          label: '关键字',
          placeholder: 'ID/登录账号/名称',
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
    bulkActions: [
      {
        limits: 'editLimit',
        label: '批量变更角色',
        icon: 'fa fa-gavel pull-left',
        primary: true,
        actionType: 'dialog',
        dialog: {
          title: '批量成员变更角色',
          body: {
            type: 'form',
            api: '$preset.apis.editMember',
            controls: [
              {
                type: 'hidden',
                name: 'ids',
              },
              {
                $ref: 'sysRoleIdPicker',
                required: true,
                multiple: false,
                name: 'newRoleId',
                label: '变更角色',
              },
              {
                type: 'tpl',
                label: '已选成员',
                inputClassName: 'container',
                tpl: `
                  <div class="row">
                    <% for(var i=0; i < data.items.length; i++) { var item=data.items[i]; %>
                      <div class="col-sm-6 m-b-xs"><%= item.nickname %> (<%= item.roleName || '无角色' %>)</div>
                    <% } %>
                  </div>
                `,
              },
              {
                type: 'checkbox',
                name: 'confirmAction',
                label: '确认操作',
                option: '请谨慎操作，必须确认后才可提交。',
              },
            ],
          },
          actions: [
            {
              label: '取消',
              actionType: 'close',
              type: 'button',
            },
            {
              label: '确认',
              actionType: 'confirm',
              type: 'button',
              level: 'primary',
              disabledOn: '!data.confirmAction',
            },
          ],
        },
      },
    ],
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
        name: 'limitName',
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
    ],
  },
}

export default members
