## Ovine Demo 项目

用于测试 cli / core 包存在 BUG。

## Development Cli Command

[项目启动指南](https://ovine.igroupes.com/org/blog/contribute/)

```bash
# 基础命令
yarn dev:lib # 使用本地文件包进行开发，会稍微慢一些，主要用于 cli/core/editor 依赖包开发
yarn start # 使用静态文件，开发 demo 项目，如果未执行过 yarn gen:static，需要先执行一次。主要用于 demo 开发
yarn ovine help # 帮助信息

# optional command
yarn gen:static # 生成静态文件，仅仅初次启动时需要执行
yarn scss # 生成静态 css 文件
yarn dll # 生成静态 dll 文件

yarn cp:lib # 将本地包复制到, node_modules 下，保持和 npm 仓库的包，功能一致。用于 预览包的效果，与 demo 项目发布。
yarn rm:lib # 将 node_modules 本地包移除，用于 事实开发 本地包，
```

## Projects Are Mainly Dependent On

- [ovine](https://github.com/CareyToboo/ovine) the main core lib.
- [amis](https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started) extend the amis lib.
- [styled-components](https://styled-components.com) css styles in js.
- [font-awesome](http://fontawesome.dashgame.com) all icons out of box.
- [bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction) full bootstrap features.

## Vscode Plugins You May Need

- `eslint` - es code linter
- `prettier` - prettify your codes
- `vscode styled component`- css in js styles highlight
- `search node_modules` - search file from `node_modules`
- `code spell checker` - for words spell check

> Any Issues? [Let Me Know](https://github.com/CareyToboo/ovine).
