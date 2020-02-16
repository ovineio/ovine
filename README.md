# RT-Admin

##### 用 JSON 配置就能生成安全、复杂、可扩展的 `Admin` 管理系统。

基于 [amis](https://github.com/baidu/amis) 二次开发。

> 在本项目使用中，有任何问题、需求、建议，请提交 issue。我看到后将第一时间处理。如果本项目对你有帮助，请点 `star` 支持，非常感谢 ^_^

### 功能

- #### [Amis](https://baidu.github.io/amis/pages/simple)

  - 基于 `bootstrap`
  - 基于 `typescript` 代码开发友好
  - 支持 `json` 配置渲染逻辑复杂的表单或页面，该功能十分强大
  - 拥有齐全的 `admin` 组件库，完全满足一般管理系统需求
  - 该框架已经广泛应用于企业级项目中，经得起实践的考验
  - 百度 FEX 团队更新频率高 (约两周一个版本)
    - 需求、功能升级、BUG、优化 等都有保障
    - 中文文档且文档内容较为齐全

- #### RtAdmin

  - 基于 `amis` 二次开发，拥有其所有优势
  - 最基本的 `react` 技术栈，拥抱 `react` 生态，无任何学习曲线。(如果非 React 技术栈，可选择 [[amis jsSdk]](https://baidu.github.io/amis/docs/getting-started#jssdk))
  - 支持生成自定义 `amis` 主题
  - 基于 `webpack` 打包，简单、速度快、支持热更新
  - 通用基本功能，开箱即用
    - 路由、权限、页面、组件 都由 `json` 配置，可简单、快速的生成复杂的 `curd` 表单或页面
    - 内置企业级权限管理完整实现，并集成到 `json` 配置中
      - 支持权限依赖、自定义设置权限、定义好权限后，可控制任何节点
    - 路由懒加载、配合 `webpack dll`，页面加载速度快
    - 本项目的内置功能修改起来十分简单，关键代码均有注释
  - 强大的 mock 方案，实现脱离后端开发

### 项目演示 [[预览 Demo]](http://rt-admin.igroupes.com/)

###### 个性化主题

![个性化主题](http://static.igroupes.com/rt-admin-intro-theme.gif)

##### JSON 配置 路由、页面、Form、组件

![JSON 配置](http://static.igroupes.com/rt-admin-intro-json.gif)

#### 强大权限管理 (集成在配置中，无需开发)

![权限管理](http://static.igroupes.com/rt-admin-intro-limit.gif)


### RtAdmin 适合谁？

- 适合`企业内部`运营管理后台
- 适合需要`强大权限`管理的后台
- 适合成`百上千个`crud 操作的后台
- 适合对自定义 UI 要求`不是极其高`的后台
- 适合喜欢偷懒的前端开发
- 适合喜欢钻研的后端开发
- 适合外包项目、私活
- 最后，我希望它适合你，节约你宝贵的时间 ^\_^ ～ (PS: 本项目采用的项目架构，也值得参考喔～)

### 快速开始

```bash
git clone git@github.com:CareyToboo/rt-admin.git
yarn install
yarn dev # 开发
yarn build # 打包
yarn open:dist # 预览打包后的页面

# 构建参数 参照 build/utils.js 文件

# 其他命令
yarn build:dll # 构建dll，一般不需要使用
yarn build:theme # 构建主题， 当需要自定义amis主题时
yarn build:analyzer # 打包代码分析
```

### 业务代码开发，只需 3 步

- 页面文件，配置文件，与路由都是自动读取，无需 `import`。
- 路由、组件权限的过滤，与设置，都集成在配置中，简单方便。
- amis 一切功能可用，可随意扩展样式主题

- 开发具体步骤为：

```javascript
/*
1. 添加 路由配置 routes/menus/xxx.ts
2. 添加 页面权限 pages/xxx/prest.ts
3. 添加 页面组件 pages/xxx/index.ts
访问对应页面
*/
// 以 /start_demo 为例，其他任何页面类似

// 1. 添加 路由配置
{
  label: '快速开始Demo', // 侧边栏显示
  nodePath: 'start_demo', // 必填，唯一标示节点路径
  icon: 'glyphicon glyphicon-gift' // 侧边栏 icon
}

// 2. 添加 页面设置
const pagePrest: PagePreset = {
  // 所有权限定义的权限， 可以在页面任何需要渲染的地方使用
  limits: {
    // key值为自定义值
    $page: { // 预设值，表示路由权限，没有这个权限，路由不会被显示，页面任何权限都会依赖这个权限
      label: '查看列表', // 页面访问查看权限
    },
    edit: {
      label: '编辑', // 默认依赖 $pages
    },
    add: {
      label: '添加',
      needs: ['edit'] // 依赖 edit 权限，只有被依赖的权限选择，才能选择该权限
    },
    del: {
      label: '删除', // 依赖 edit,add 权限
      needs: ['add']
    }
    // ... 可以定义任何其他权限
  },
  /**
   当前页面定义的api
   被设置的
  */
  apis: { // key值为自定义值， RequestOption
    list: {
      url: 'xxxx',
      limits: ['$page'], // 访问该接口，必须具备的权限key，支持字符串,数组
      mockSource: {}, // mock数据
      //... 其他 RequestOption 选项
    }
    // ... 其他任何接口定义
  }
}
export default pagePrest // 导出配置

// 3. 添加 页面组件， amis schema配置
export const schema = {
  type: 'rt-crud', // 封装amis的crud,增删改查页面
  api: '$prest.apis.list', // 可以访问 prest.ts里定义的 apis 的值
  headerToolbar: [{
    $preset: 'actions.add' // 访问页面预设值
  }],
  columns: [{
    name: 'id'
    label: 'ID',
  }, {
    name: 'name'
    label: '昵称',
  }, {
    // ... 其他列
  }, {
    type: 'operation',
    label: '操作',
    buttons: [
      { $preset: 'actions.view' }, // 访问预设值 查看 actions.view
      { $preset: 'actions.edit' },  // 访问预设值 编辑 actions.edit
      { $preset: 'actions.delete' }, // 访问预设值 删除 actions.delete
    ],
  }]
  // 预设值, 两种使用方式 {$prest: 'forms.xxx'} 或者 {xxx: '$preset.forms.xxx'}
  // 意义： 便于权限梳理、将forms比较大的 json 更容易定义和移动
  $prest: {
    // amis Action渲染器
    actions: {
      add: { // 添加操作
        type: 'button',
        label: '添加',
        actionType: 'dialog',
        limits: 'add', // 需要满足 add 权限，否则不渲染
        dialog: {
          title: '新增',
          body: '$preset.forms.add', // 访问预设值 forms.add
        },
      },{
        // ... 其他 actions
      }
    },
    // amis From渲染器
    forms: {
      add: {
        type: 'form',
        api: '$preset.apis.add', // 访问预设值 apis.add
        controls: [{
          type: 'text',
          name: 'id',
        }, {
          // ... 其他 input
        }]
      },
      // ... 其他 form
    }
  }
}
```

### 开发工具

- 推荐使用 `vscode` 并下载对应插件，将极大提升开发效率与开发体验
- 必备 `vscode-plugin` 可自行下载
  - `tslint` - ts 代码检查
  - `prettier` - 可自动格式化代码
  - `vscode styled component`- `css` 提示
  - `path intellisense` - 路径自动补全
  - `search node_modules` - 快速查看 `node_modules` 包中源文件
  - `code spell checker` - 检查错误单词

### TODO

- 第一阶段

  - 持续修复现存 BUG
  - 搭建文档页面
  - 继续完善 `demo` 项目，最终上线为实际应用
  - 核心模块编写测试代码
  - 配套 `api` 开发

- 第二阶段

  - 发布 npm 包，减少开发者使用门槛
    - 将现在项目进行拆分，核心公用代码抽离为 `npm` 包，其他代码作为 `demo` 应用
    - 思考如如何 去 `react` 化，兼容更多库。
  - 实现 `api` 实时构建 `admin` 页面

- 第三阶段
  - 实现拖拽生成 `UI`，并产生 `admin` 页面，降低使用门槛

> 期待你的 PR，支持开源 ^\_^

### 资源

- [amis](https://baidu.github.io/amis/docs/getting-started) 非常感谢百度团队的开源贡献
- [font-awesome](http://fontawesome.dashgame.com)
- [bootstrap](https://v3.bootcss.com/components)
- [styled-components](https://styled-components.com)
