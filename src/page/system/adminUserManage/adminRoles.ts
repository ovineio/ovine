import { TableConfig } from '../../../component/TableView';

const config: TableConfig = {
  actionList: {
    load: {
      actionkey: 'list',
      api: 'list',
    },
    add: {
      text: '添加角色',
      actionkey: 'add',
      api: 'add',
      formkey: 'add',
    },
    edit: {
      text: '编辑',
      actionkey: 'edit',
      api: 'edit',
      formkey: 'edit',
    },
    limitsConf: {
      text: '权限设置',
      actionkey: 'limitsConf',
      api: 'edit',
      click({ linkTo, source, requestOptions }) {
        linkTo('/system/adminUserManage/adminRoles/limitsConf', {
          source,
          requestOptions,
        });
      }
    },
    del: {
      text: '删除',
      actionkey: 'del',
      api: 'del',
      beforeClick: ({ source = {} }) => {
        return { _id: source._id };
      },
      modal: {
        modalType: 'confirm',
        modalProps: {
          title: '提示信息',
          content: '是否确认删除当前项',
        }
      }
    },
  },
  column: {
    _id: {
      title: 'ID',
      width: 60,
      componentType: 'Text',
    },
    name: {
      title: '角色名',
      width: 150,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    remark: {
      title: '备注',
      width: 150,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    timestamp: {
      title: '时间',
      componentType: 'Date',
    },
    handler: {
      componentType: 'Action.List',
      list: ['edit', 'limitsConf', 'del'],
    },
  },
  handler: ['add'],
  form: {
    add: {
      title: '添加角色',
      item: {
        name: {
          label: '角色名称',
          componentType: 'Text',
          required: true,
        },
        remark: {
          label: '角色描述',
          componentType: 'Text',
          required: true,
          componentProps: {
            isTextarea: true,
          },
        },
      }
    },
    edit: {
      extends: 'add',
      title: '编辑角色',
    }
  },
};

export default config;
