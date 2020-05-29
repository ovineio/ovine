---
id: start
title: 快速开始
---

## 创建应用

执行执行以下命令，可以方便快捷的创建 Ovine 应用。

> 官方推荐使用 yarn 作为包管理工具

```bash
npx @ovine-init init my-app
cd my-app
yarn install
yarn start
```

尽量使用 `npx` 来初始化构建项目，保证初始化使用的`@ovine-init`包是最新的版本。点击解更多 [npx 使用介绍](http://www.ruanyifeng.com/blog/2019/02/npx.html)

### 初始化项目

```bash
npx @ovine-init init my-app
```

执行初始化命令时有以下步骤

- 选择应用模版
- 选择是否使用 Typescript
- 选择是否使用 Eslint

完成上述步骤，将创建一个 Ovine 应用

### 安装依赖包

```bash
cd my-app
yarn install
```

本项目依赖了大量的第三方依赖包，此过程会因为网络环境，或者镜像源的不同，时间会有差异，也有可能会中断。如果安装包存在异常，可参考将 npm 切换为淘宝镜像源。

```bash
## 切换为淘宝镜像源
npm config set registry http://registry.npm.taobao.org/
## 还原为官方镜像
npm config set registry https://registry.npmjs.org/
```

> 为什么不把安装依赖的命令集成在 init 步骤中？由于项目依赖太多第三方包，很多依赖包，版本特别旧。不仅安装时间长，并且会出现大量警告信息。很容易在构建的时候出现网络异常，从而中断创建应用的过程。因为安装包而重新执行初始化的过程会非常繁琐。因此将安装步骤抽离为一个单独的步骤，遇到依赖包问题，可以多次安装。

### 运行应用

```bash
yarn start    # 开启 devSever
yarn build    # 构建项目
```

Ovine 是一个开箱即用的框架。`@voine/cli` 提供了开发项目必备的的的 Cli 命令，并将一些常用的写在 `package.json scripts` 中，方便使用。这三个命令是最基本开发命令。更详细的文档请查阅[Cli 命令介绍](/org/docs/advance/cli)

## 目录结构

这里简单列出所有最基本的目录结构，只是用作举例，**并不代表实际的项目**。强制约束的文件目录或者文件，会特别强调说明。未强调的，不做任何约束。

```
my-app
├── README.md
├── node_modules           npm模块文件目录
├── package.json
├── .gitignore
├── .vscode
├── ovine.config.js        Ovine 编译配置
├── dist                   打包文件目录
├── static                 静态资源文件目录
├── scss                   scss 文件目录
├── .ovine                 Ovine编译文件
│   ├── static
│   ├── styles
│   ├── xxx.json
└── src                    源代码目录
    ├── index.js              唯一入口文件
    ├── pages                 路由页面文件目录
    │   ├── blog
    │   │   ├── index.js         页面唯一入口
    │   │   ├── preset.js        页面预设置文件
    │   │   ├── mock.js          mock数据文件
    │   │   └── styled.js
    └── app
        ├── env.js
        ├── constants.js
        └── request.js
```

### 强制约束目录说明

> 为方便描述 `/` 为 Ovine 应用跟目录，而不是操作系系统据绝对路径根目录。比如 my-app 举例， `/` 实际为： `/Users/username/pathto/my-appe`

- **/node_moudles** npm 模块文件目录,包含所有的第三方依赖
- **/dist** 构建文件输出目录，可以直接用于部署的文件目录
- **/static** 静态资源目录，比如图片，某些不需要编译的 scripts,css 等，字体文件
- **/scss** 源代码文件目录，主要是手动编写的代码
- **/.ovine** Ovine 编译生成的文件存放的目录
  > 此文件目录不能删除，也不能被 `.gitignore`。缓存很多静态文件，可用于提高编译和页面加载速度
- **ovine.config.js** Ovine 编译配置文件。[查看编译配置](/org/advance/configurations)
  > Ovine 控制编译的一些配置。
- **/src** 源代码文件目录，主要是手动编写的代码
  - **/src/index.js** 应用唯一入口文件，主要用于 export Ovine 逻辑配置文件。[查看逻辑配置](/org/advance/configurations)
  - **/src/pages** 路由页面文件目录
  - **/src/pages/xxx/index.js** 页面文件入口文件，主要是 export 页面 Json
  - **/src/pages/xxx/preset.js** 页面预设置文件，主要用权限约束
    > xxx 页面下的预设文件，可以不存在该文件。但是要想添加权限相关内容，必须使用此文件名
  - **/src/pages/xxx/mock.js** 用于创建 mock 数据的文件。[查看 mock 数据文档](/org/advance/mock)
    > mock.js 文件比较特殊，是 Ovine 实现 mock 的一种方案。因此 整个项目内任何 `/**/*/mock.js`，都只能用作产生 mock 数据的用途。因此不能用 mock.js 来写业务逻辑！！！
