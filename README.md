# RT-admin

rt-admin管理后台系统基于[ant-design-pro](https://github.com/ant-design/ant-design-pro)的ts重构版本，针对中小型公司内部业务的一体化解决方案。主要目的是应用于强运营性业务，超多表格的管理系统。[live demo](http://rt-admin.uk.to:8020)

## 开发

```bash
yarn install
yarn run start # 开启mock服务
```

### 当前主要功能

- mock服务
  - 完全实现脱离服务端开发，非常方便的自定义mock服务
- 完整的权限设置
  - 支持粒度前端路由，表操作
  - 后端每个接口控制
- 动态路由`yaml配置`
- 对纯表格页面`tableview`功能封装`json配置`
  - 检索条件
  - 表列数据渲染
  - 表格增、删、改操作
  - 表格弹框编辑

### TO DO LIST

- [] 表格常用工具功能
- 添加公共组件
  - [] 富文本编辑器
  - [] markdown编辑器
  - [] json代码编辑器
  - [] 日期选择
- [] dashboard展示
- [] 解决现存BUG

### 添加新的`表格功能`分为四个步骤
1. 添加 `mock api`
2. 添加 路由`yaml`配置
3. 添加 表格`json`配置
4. 测试新功能，修改配置


### 简单使用例子讲解`图片海报`表

1. 添加mock接口 `mock/server/api/poster.js`

```js
const Chance = require('chance'); // 生成随机数据
const utils = require('../utils'); // 工具方法，可自定义扩充

const c = new Chance();

// 生成120条数据， 按照 固定格式
const sourceList = utils.times(120, (index => ({
  _id: String(index + 200),
  title: c.word({ word: 6 }),
  click_url: c.url({
    path: 'qwe/er/123',
    domain: 'asdf',
  }),
  pic_url: 'http://pic2.qiyipic.com/image/20150313/76/b7/a_100010961_m_601_m1_180_236.jpg',
  order: c.integer({ max: 1000, min: 0 }),
  status: c.bool(),
  timestamp: c.date({ year: 2018 }),
  remark: c.sentence({ words: 4 }),
})));

// 自动生成 增删改查 接口
module.exports = utils.renderCrudApi({
  idKey: '_id', // 唯一标示key值
  key: 'poster',
  source: sourceList, // 源数据
  orderBy: [['status', 'order'], ['desc', 'asc']], // 排序
});

```

2. 添加路由配置 `src/config/menu/daily.yaml`
    - `path` 会自动设置 页面路由
    - `name` 会自动设置 面包屑
```yaml
name: 日常运营 # 一级菜单 当前path的名称
icon: calendar # 侧边栏 icon
path: daily # 路径
children:
  -
    name: 公告通知 # 二级菜单 
    path: publicNotice
    children:
      -
        name: 图片海报 # 三级菜单 
        path: poster
        tabs: true # 子菜单 右侧表格，以tab形式 展示， false时，为树形展示
        api: # 配置后端请求接口
          key: poster # 表示 restful key, 自动使用 增删改查接口
        children:
          -
            name: 网站海报 # 具体展示表格名字
            path: pcwebPoster # 表格路径
            isTableView: true # 设置 Tableview 组件
          -
            name: 安卓海报 # 具体展示表格名字
            path: androidPoster # 表格路径
            isTableView: true # 设置 Tableview 组件
```

3. 编写表格 `网站海报`的配置`src/page/daily/publicNotice/poster/pcwebPoster.ts`， 实现TableConfig接口
    - 注意配置必须为*.ts文件，进行类型检查
    - `daily/publicNotice/poster/pcwebPoster` 为 `src/config/menu/*.yaml`配置的`path`嵌套值

```javascript
import { message } from 'antd';
// 虽然此处嵌套路径较深，在ts文件中输入 TableConfig 时，编辑器会自动引入依赖
import { TableConfig } from '../../../../component/tableView';

// ts会进行类型检查与提示，可安全编写配置
// 实现TableConfig配置
// 该文件为普通ts文件，最终返回为json格式数据，可拆分文多文件，抽离公用部分
const config: TableConfig = {
  actionList: { // 配置 后端请求接口与权限设置
    load: { // 该项是必须传， 为读取表格数据接口
      actionkey: 'list', // 对应的权限的 key值
      api: 'list', // 使用api接口
      requestOptions: { // 请求获取数据接口的参数
        data: {
          type: 0,
        }
      },
    },
    add: { // 添加 按钮
      text: '添加',
      actionkey: 'add',
      api: 'add',
      formkey: 'add',
      requestOptions: { // 设置请求时 默认参数
        data: {
          status: false,
        }
      },
    },
    edit: { // 编辑 按钮
      text: '编辑',
      actionkey: 'edit',
      api: 'edit',
      formkey: 'edit',
      requestOptions: { // 操作成功直接同步更改数据，不刷新表格（下同）
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
      beforeRender({ source }) { // 渲染前 操作
        if (source && source.status) {
          return false; // 表示不渲染
        }
      },
      beforeClick({ source }) { // 点击前操作
        return { // 返回数据为点击时 传入接口数据
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
        const { order = 0, _id, _uuid } = source;
        const newOrder: number = parseInt(order, 10) - 1;
        if (newOrder < 0) {
          message.warn('排序不能为负数值');
          return false;
        }
        return {
          _id,
          _uuid,
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
  column: { // 表格 标题设置，兼容antd table column 其他配置
    _id: {
      title: 'ID',
      width: 60,
      componentType: 'Number.Int', // 必传参数，标示表格数据渲染 组件类型
    },
    title: {
      title: '标题',
      width: 150,
      componentType: 'Text',
      componentProps: { // Text组件的参数
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
    handler: { // 表格行操作设置 【这里是 actionlist配置中 key】
      componentType: 'Action.List',
      list: ['edit', 'on', 'off', 'up', 'down', 'del'],
    },
  },
  handler: ['add'], // 表格右上角handler操作配置， 传入 form 弹窗 key值
  form: { // 添加 弹窗
    add: {
      title: '添加网站海报', // 弹窗标题
      item: { // 每一个input配置， 兼容 antd form组件配置
        omitItems: ['_id'], // 不显示字段
        _id: {
          label: 'ID',
          componentType: 'Text', // 输入组件类型
          componentProps: { // 输入组件参数
            isNumber: true,
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
          layout: { // 布局设置
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
      }
    },
    edit: { // 编辑弹窗 继承 add 弹窗配置， 仅修改了 标题
      extends: 'add',
      title: '编辑网站海报',
    }
  },
};

export default config;
```

## 核心技术栈

- [react](https://github.com/facebook/react)
- [typescript](https://github.com/facebook/react)
- [ant-design](https://github.com/ant-design/ant-design)
- [dva](https://github.com/dvajs/dva)
- [roadhog](https://github.com/sorrycc/roadhog)
- [redux-saga](https://github.com/redux-saga/redux-saga)


### 贡献
> 该项目功能较多，希望小伙伴一起贡献代码，有任何问题或者意见可以随时提交issue.






