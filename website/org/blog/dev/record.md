### 记录

- github stars button
  - https://shields.io/category/social
  - http://ghbtns.com/#star
- 文档全文搜索功能
  - https://docsearch.algolia.com/apply 申请
- react-router, [Router Vs BrowserRouter](https://stackoverflow.com/questions/56707885/browserrouter-vs-router-with-history-push)
- [Router with basename](https://stackoverflow.com/questions/47580538/react-router-v4-basename-and-custom-history)

- npm @xxxx/xxx scope 包,需要在 npm 网站，注册一个 org，才能正常 publish 成功。[npmScope](https://docs.npmjs.com/creating-and-publishing-an-org-scoped-package)

- webpack plugin 需要学习插件编写，如果遇到 webpack loader,或者 plugin 问题，需要仔细研读文档，再 github 源码和 issue，或者在 node_modules 目录下打日志，仔细分析问题。[webpackPlugin 文档](https://webpack.js.org/api/compiler-hooks/)

- You might have more than one copy of React in the same app。同一个应用中，引入了多个 React 包。

  - describe: https://github.com/facebook/react/issues/13991#issuecomment-435135293
  - fixed: https://github.com/facebook/react/issues/13991#issuecomment-449597362

- webpack.SplitChunks.minSize 会将小包合并，在测试打包配置是否有效时，一定将其设置为 0。
- splitChunks 是文件拆分，和按需动态异步加载没有关系。在处理异步加载未拆文件时，可用 splitChunks.cacheGroup.name 返回不同的文件名与 enforce=true,来强制拆分文件。
- webpack 多个'rules' 匹配到相同文件时，处理不明确。会导致非预期打包，因此可使用 `exclude`、`include`来匹配具体文件，避免 loader 处理不明确的情况。
- commander 包会自动转义
  - 默认值为布尔值
  - '--a-b' => 'aB'
  - '--no-a' => 'a'
  - '--a-b \<abc\>' => 'abc'
- require(`../a/${var}`) 变量名，一定要慎重。会将模块 /a/xxx 所有引入代码，使 import 动态加载无效。
- yarn 报错。 Browserslist: caniuse-lite is outdated. Please run next command `yarn upgrade`
  For what it's worth, it should be sufficient to search caniuse-lite@ in your yarn.lock, delete just those entries, and reinstall. That avoids the versions floating for all your other packages.
- 循环依赖问题方案

  - 抽离公共代码为一个单独模块
  - 使用消息机制，使用 on,emit 模式
  - 使用 全局变量模式
  - 使用代码懒加载

- jest 相关

  - tsconfig.js 'paths' alias. [github issue](https://github.com/kulshekhar/ts-jest/issues/414)
  - Handling Static Assets. [jest doc](https://jestjs.io/docs/en/webpack)

- babel build mode: ReferenceError regeneratorRuntime is not defined. [issue](https://github.com/babel/babel/issues/9849)

- node 包 http-server ，预计 0.13.0 支持 baseurl. 因此 当 ovine.config.js 中 baseUrl 不是 '/' 时，open:dist 执行不会访问到正确文件。 [issue](https://github.com/http-party/http-server/issues/595)

- ovine/cli 如果 ovine.config.publicPath 改变时 需要 重新执行 ovine dll 方法，因为有静态资源需要 publicPath 打包。

  - 思考 dll 目录下静态资源使用 webworker 来缓存可以极大提升加载速度
  - dll 目录 使用 cdn 配置

- lerna 项目管理

  - 每次发包之前需要更改版本号 publish.
  - 更改 version: yarn lerna version prerelease --no-push prerelease
  - 发布 包到 npm: yarn lerna publish from-package
  - 发包步骤
    - npm config set registry http://registry.npmjs.org
    - npm login
    - npm config set registry https://registry.npm.taobao.org

- react-hot-loader 不更新组件

  - 一定要注意是否使用了缓存，缓存数据每次都是一致的，因此永远不会更新组件
  - 由于同时使用了 webpack HotModuleReplacementPlugin 与 react-hot-loader 因此某些更新会触发两次渲染。[issue](https://github.com/gaearon/react-hot-loader/issues/713)

- webpack hot replace 当主渲染逻辑报错时，会自动刷新。如果发现热更新无法使用。出现一致刷新的情况，需要注意检查是否热更新时有报错。

- react-router 不要重新调用 `createBrowserHistory`否则会`You cannot change <Router history>` 报错，router 的跳转将失效，因此要注意在热更新的时候特殊处理。[issue](https://github.com/reactjs/react-router-redux/issues/179)

- amis 使用 @renderer 注册渲染器时，热更新时，会报错。重复渲染

  - drawer 渲染器 closeOnOutside 会导致 子弹窗意外关闭

- yarn workspace 对项目的依赖包做了 处理，相同依赖包都会被提升到 ROOT 文件夹，因此要完整测试 开发好的包需要另外建立一个文件夹

- webpack 配置文件路径的时候，切记使用 `[\\/]` 路径做分割符号，不然在 windows 上识别不了。导致路径匹配错误，引起很难发现的异常。
