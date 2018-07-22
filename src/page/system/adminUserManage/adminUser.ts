import { TableConfig, TableLoadType } from '../../../component/tableView';
import request from '../../../service/request';

let roleData: any[] = [];

const getRoleOptions = () => {
  const result: any = {};
  roleData.map((i: any) => {
    const { name, _id } = i;
    result[_id] = name;
  });
  return result;
};

const LoadSuccessHandler = async (adminSource: any) => {
  const roleSource: any = await request({ api: 'role/list', data: { is_all: true } });
  roleData = roleSource.data;
  adminSource.data.map((i: any) => {
    const temp = roleData.find((j: any) => j._id === i.role) || {};
    i.role = temp.name;
    return i;
  });
  return adminSource;
};

const config: TableConfig = {
  actionList: {
    load: {
      actionkey: 'list',
      api: 'list',
      requestOptions: {
        successHandler: LoadSuccessHandler
      },
    },
    add: {
      text: '添加人员',
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
      text: '角色设置',
      actionkey: 'limitsConf',
      api: 'edit',
      formkey: 'limit',
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
        },
      },
    },
  },
  filter: {
    item: {
      _id: {
        label: 'ID',
        componentType: 'Text',
        componentProps: {
          isNumber: true,
        },
      },
      name: {
        label: '登录名',
        componentType: 'Text',
      },
    },
  },
  column: {
    _id: {
      title: 'ID',
      width: 60,
      componentType: 'Number.Int',
    },
    name: {
      title: '登录名',
      width: 150,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    real_name: {
      title: '名字',
      width: 150,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    role: {
      title: '角色',
      width: 80,
      componentType: 'Text',
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
      title: '添加人员',
      item: {
        name: {
          label: '账号',
          componentType: 'Text',
          required: true,
        },
        real_name: {
          label: '名字',
          componentType: 'Text',
          required: true,
        },
        password: {
          label: '密码',
          componentType: 'Text',
          required: true,
        },
      }
    },
    edit: {
      extends: 'add',
      title: '编辑人员',
      setItemMap: {
        'password.required': false,
        'password.help': '不填为不修改密码',
      },
    },
    limit: {
      extends: 'add',
      title: '角色设置',
      setItemMap: {
        'real_name.componentProps.disabled': true,
      },
      itemKeys: ['real_name', 'role'],
      item: {
        role: {
          label: '角色',
          componentType: 'Select',
          componentProps: {
            getOptions: getRoleOptions
          },
        },
      },
    },
  },
};

export default config;
