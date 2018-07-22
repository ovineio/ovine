import { message } from 'antd';
import { TableConfig, TableLoadType } from '../../../../component/tableView';

const config: TableConfig = {
  actionList: {
    load: {
      actionkey: 'list',
      api: 'list',
      requestOptions: {
        data: {
          type: 0,
        }
      },
    },
    add: {
      text: '添加',
      actionkey: 'add',
      api: 'add',
      formkey: 'add',
      tableLoadType: TableLoadType.LOAD,
      requestOptions: {
        data: {
          status: false,
        }
      },
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
    on: {
      text: '上线',
      actionkey: 'edit',
      api: 'edit',
      requestOptions: {
        updateSyncType: 'edit',
      },
      beforeRender({ source }) {
        if (source && source.status) {
          return false;
        }
      },
      beforeClick({ source }) {
        return {
          _id: source._id,
          status: true,
        };
      },
    },
    off: {
      text: '下线',
      actionkey: 'edit',
      api: 'edit',
      requestOptions: {
        updateSyncType: 'edit',
      },
      beforeRender({ source }) {
        if (source && !source.status) {
          return false;
        }
      },
      beforeClick({ source }) {
        return {
          _id: source._id,
          status: false
        };
      }
    },
    up: {
      text: '上移',
      actionkey: 'edit',
      api: 'edit',
      requestOptions: {
        updateSyncType: 'edit',
      },
      beforeClick: ({ source }) => {
        const { order = 0, _id } = source;
        const newOrder: number = parseInt(order, 10) - 1;
        if (newOrder < 0) {
          message.warn('排序不能为负数值');
          return false;
        }
        return {
          _id,
          order: newOrder,
        };
      },
    },
    down: {
      text: '下移',
      actionkey: 'edit',
      api: 'edit',
      requestOptions: {
        updateSyncType: 'edit',
      },
      beforeClick: ({ source }) => {
        const { order = 0, _id } = source;
        const newOrder: number = parseInt(order, 10) + 1;

        return {
          _id,
          order: newOrder,
        };
      },
    },
    del: {
      text: '删除',
      actionkey: 'del',
      api: 'del',
      requestOptions: {
        updateSyncType: 'del',
      },
      beforeClick: ({ source }) => {
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
      componentType: 'Number.Int',
    },
    title: {
      title: '标题',
      width: 150,
      componentType: 'Text',
      componentProps: {
        length: 25,
      },
    },
    click_url: {
      title: '链接',
      width: 150,
      componentType: 'Text',
      componentProps: {
        isLink: true,
        length: 25,
      },
    },
    pic_url: {
      title: '图片',
      sorter: false,
      componentType: 'Image',
    },
    order: {
      title: '排序',
      width: 50,
      defaultSortOrder: 'ascend',
      componentType: 'Number.Int',
    },
    status: {
      title: '状态',
      componentType: 'Status.YesNo',
      componentProps: {
        text: ['已下线', '已上线'],
      },
    },
    timestamp: {
      title: '添加时间',
      componentType: 'Date',
    },
    handler: {
      componentType: 'Action.List',
      list: ['edit', 'on', 'off', 'up', 'down', 'del'],
    },
  },
  handler: ['add'],
  form: {
    add: {
      title: '添加网站海报',
      omitItems: ['_id'],
      item: {
        _id: {
          label: 'ID',
          componentType: 'Text',
          componentProps: {
            isNumber: true,
            disabled: true
          },
        },
        title: {
          label: '标题',
          componentType: 'Text',
          required: true,
        },
        click_url: {
          label: '链接',
          componentType: 'Text',
          help: '请输入完整url链接 http://'
        },
        type: {
          label: '跳转类型',
          componentType: 'Select',
          componentProps: {
            options: {
              1: '链接地址',
              3: '标签ID',
              4: '外跳'
            },
          },
          layout: {
            itemCol: {
              span: 12,
            },
            labelCol: {
              span: 10,
            },
            wrapperCol: {
              span: 14,
            }
          }
        },
        order: {
          label: '排序',
          componentType: 'Text',
          componentProps: {
            isNumber: true,
          },
          layout: {
            itemCol: {
              span: 12,
            },
            labelCol: {
              span: 10,
            },
            wrapperCol: {
              span: 10,
            }
          }
        },
        click_val: {
          label: '跳转值',
          componentType: 'Text',
        },
        pic_url: {
          label: '图片',
          componentType: 'Text',
        },
        qd_name: {
          label: '对应渠道名',
          componentType: 'Text',
        },
      }
    },
    edit: {
      extends: 'add',
      title: '编辑网站海报',
    }
  },
};

export default config;
