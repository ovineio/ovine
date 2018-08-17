# RT-admin

rt-admin管理后台系统基于[ant-design-pro](https://github.com/ant-design/ant-design-pro)的ts重构版本，针对中小型公司内部业务的一体化解决方案。主要目的是应用于强运营性业务，100+表格业务的管理系统。同时也完全兼容自定义页面。[live demo](http://rt-admin.uk.to:8020)

## 开发

```bash
npm install
npm start # 默认开启mock服务
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
- 常用公共组件
  - 富文本编辑器
  - markdown编辑器
  - json代码编辑器

### TO DO LIST

- 表格常用工具功能 [doing]
- 封装上传文件功能
- 添加公共组件
  - 日期选择
  - 视频播放器
- dashboard展示
- 个性化设置
  - 支持i18n，中-英
  - 支持暗色/亮色颜色皮肤
  - 支持两种页面布局方式
- 解决现存BUG
- 整理组件代码，将非TS组件，逐步转化为TS组件
- 代码性能优化、js文件拆包异步加载优化
- 部署项目文档

### 添加新的`表格功能`简化为一下几步骤
1. 添加 `mock api`
2. 添加 路由`yaml`配置
3. 添加 表格`json`配置
4. 测试新功能，修改配置
5. 对接真实后端 `api server`


### 简单使用例子讲解`图片海报`表

1. 添加mock接口 `mock/server/api/poster.js`

```js
const Chance = require('chance'); // 生成随机数据
const _ = require('lodash');

const c = new Chance();

// 生成120条数据， 按照 固定格式
const sourceList = _.times(120, (index => ({
  _id: String(index + 200),
  title: c.word({ word: 6 }),
  click_url: c.url({
    path: 'qwe/er/123',
    domain: 'niasd',
  }),
  pic_url: 'http://image78.360doc.com/DownloadImg/2014/08/2509/44580952_2.jpg',
  order: c.integer({ max: 1000, min: 0 }),
  status: c.bool(),
  timestamp: c.date({ year: 2018 }),
  remark: c.sentence({ words: 4 }),
})));

module.exports = {
  idKey: '_id', // 唯一标示key值
  key: 'poster', // 接口名
  orderBy: [['status', 'order'], ['desc', 'asc']], // 排序
  source: sourceList, // 源数据
};
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
// 该文件为普通ts文件，最终返回为json格式数据，可拆分文多文件，抽离公用部分
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
    ...restAction // 剩余操作配置类似
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
    ...someColumn, // 其他列配置类似
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
        ...restInput // 其他form item配置类似
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






