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

- You might have more than one copy of React in the same app

  - describe: https://github.com/facebook/react/issues/13991#issuecomment-435135293
  - fixed: https://github.com/facebook/react/issues/13991#issuecomment-449597362

- webpack.SplitChunks.minSize 会将小包合并，在测试打包时，一定将其设置为 0。
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
- 循环依赖问题
  - a -> b , b -> a 。这种情况，就将公共地方抽出一个 c, 变成 a -> c, b -> c 。或者使用消息机制，使用 on,emit 模式。
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
  - 更改 version: yarn lerna version prepatch --no-push
  - 发布 包到 npm: yarn lerna publish from-package
