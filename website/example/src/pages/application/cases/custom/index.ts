export const schema = {
  title: '带边栏联动',
  aside: {
    type: 'form',
    wrapWithPanel: false,
    target: 'window',
    submitOnInit: true,
    body: [
      {
        type: 'input-tree',
        name: 'cat',
        inputClassName: 'no-border',
        submitOnChange: true,
        selectFirst: true,
        options: [
          {
            label: '分类1',
            value: 'cat1',
          },
          {
            label: '分类2',
            value: 'cat2',
            children: [
              {
                label: '分类 2.1',
                value: 'cat2.1',
              },
              {
                label: '分类 2.2',
                value: 'cat2.2',
              },
            ],
          },
          {
            label: '分类3',
            value: 'cat3',
          },
          {
            label: '分类4',
            value: 'cat4',
          },
        ],
      },
    ],
  },
  toolbar: [
    {
      type: 'button',
      actionType: 'dialog',
      label: '新增',
      primary: true,
      dialog: {
        title: '新增',
        body: {
          type: 'form',
          name: 'sample-edit-form',
          api: 'post:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample',
          body: [
            {
              type: 'input-text',
              name: 'engine',
              label: 'Engine',
              required: true,
            },
            {
              type: 'divider',
            },
            {
              type: 'input-text',
              name: 'browser',
              label: 'Browser',
              required: true,
            },
            {
              type: 'divider',
            },
            {
              type: 'input-text',
              name: 'platform',
              label: 'Platform(s)',
              required: true,
            },
            {
              type: 'divider',
            },
            {
              type: 'input-text',
              name: 'version',
              label: 'Engine version',
            },
            {
              type: 'divider',
            },
            {
              type: 'input-text',
              name: 'grade',
              label: 'CSS grade',
            },
          ],
        },
      },
    },
  ],
  body: {
    type: 'crud',
    draggable: true,
    api: {
      url: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample',
      sendOn: 'this.cat',
    },
    filter: {
      title: '条件搜索',
      submitText: '',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          placeholder: '通过关键字搜索',
          addOn: {
            label: '搜索',
            type: 'submit',
          },
        },
        {
          type: 'plain',
          text: '这里的表单项可以配置多个',
        },
      ],
    },
    bulkActions: [
      {
        label: '批量删除',
        actionType: 'ajax',
        api: 'delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$ids',
        confirmText: '确定要批量删除?',
      },
      {
        label: '批量修改',
        actionType: 'dialog',
        dialog: {
          title: '批量编辑',
          name: 'sample-bulk-edit',
          body: {
            type: 'form',
            api:
              'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/bulkUpdate2',
            body: [
              {
                type: 'hidden',
                name: 'ids',
              },
              {
                type: 'input-text',
                name: 'engine',
                label: 'Engine',
              },
            ],
          },
        },
      },
    ],
    quickSaveApi:
      'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/bulkUpdate',
    quickSaveItemApi: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$id',
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20,
        sortable: true,
        type: 'text',
        toggled: true,
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        sortable: true,
        searchable: true,
        type: 'text',
        toggled: true,
      },
      {
        name: 'browser',
        label: 'Browser',
        sortable: true,
        type: 'text',
        toggled: true,
      },
      {
        name: 'platform',
        label: 'Platform(s)',
        sortable: true,
        type: 'text',
        toggled: true,
      },
      {
        name: 'version',
        label: 'Engine version',
        quickEdit: true,
        type: 'text',
        toggled: true,
      },
      {
        name: 'grade',
        label: 'CSS grade',
        quickEdit: {
          mode: 'inline',
          type: 'select',
          options: ['A', 'B', 'C', 'D', 'X'],
          saveImmediately: true,
        },
        type: 'text',
        toggled: true,
      },
      {
        type: 'operation',
        label: '操作',
        width: 130,
        buttons: [
          {
            type: 'button',
            icon: 'fa fa-eye',
            actionType: 'dialog',
            dialog: {
              title: '查看',
              body: {
                type: 'form',
                body: [
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
            actionType: 'dialog',
            dialog: {
              title: '编辑',
              body: {
                type: 'form',
                name: 'sample-edit-form',
                api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$id',
                body: [
                  {
                    type: 'input-text',
                    name: 'engine',
                    label: 'Engine',
                    required: true,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    type: 'input-text',
                    name: 'browser',
                    label: 'Browser',
                    required: true,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    type: 'input-text',
                    name: 'platform',
                    label: 'Platform(s)',
                    required: true,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    type: 'input-text',
                    name: 'version',
                    label: 'Engine version',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    type: 'input-text',
                    name: 'grade',
                    label: 'CSS grade',
                  },
                ],
              },
            },
          },
          {
            type: 'button',
            icon: 'fa fa-times text-danger',
            actionType: 'ajax',
            confirmText: '您确认要删除?',
            api:
              'delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$id',
          },
        ],
        toggled: true,
      },
    ],
  },
}

// export const schema = {
//   type: 'page',
//   title: '测试自定义组件',
//   body: {
//     type: 'form',
//     title: 'custom 组件',
//     controls: [
//       {
//         type: 'text',
//         name: 'test',
//       },
//       {
//         type: 'custom',
//         name: 'myName',
//         label: '自定义组件',
//         onMount: (dom, _, __, props) => {
//           const button = document.createElement('button')
//           button.innerText = '设置为123'
//           button.onclick = (event) => {
//             props.store.setValueByName('test', 123)
//             event.preventDefault()
//           }
//           dom.appendChild(button)
//         },
//       },
//     ],
//   },
// }
