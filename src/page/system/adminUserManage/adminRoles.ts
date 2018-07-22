import { TableConfig, TableLoadType } from '../../../component/tableView';

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
      tableLoadType: TableLoadType.LOAD,
    },
    edit: {
      text: '编辑',
      actionkey: 'edit',
      api: 'edit',
      formkey: 'edit',
      requestOptions: {
        updateSyncType: 'edit',
      },
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
      requestOptions: {
        updateSyncType: 'del',
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
      componentType: 'Number.Int',
    },
    name: {
      title: '角色名',
      width: 100,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    remark: {
      title: '备注',
      width: 300,
      componentType: 'Text',
      componentProps: {
        length: 100,
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
