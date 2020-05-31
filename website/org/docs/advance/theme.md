---
id: theme
title: 样式与主题
---

## Ovine 样式方案

Ovine 采用的是 `css in js` 的方式写样式。主要依赖的是比较流行的[styled-components 库](https://github.com/styled-components/styled-components)。而 Amis 的样式方案是 Scss。虽然对于写样式这一点上，看起来有点冲突。实际上，两种方式合起来使用也没有什么关系。

:::info 建议
建议写样式使用 `styled-components` 写页面样式，而不是用 `scss`。请在使用的编辑器中下载 `styled-components` 对应的插件，将会事半功倍。
:::

为什么使用 `css in js` 而不是 `scss`?

- `scss` 需要预编译编译对于动态的添加样式来说，比较麻烦，似乎只能使用 `style`
- `styled-components` 提供了非常灵活的写样式方式。可以的将样式，当作一个配置项传给组件。而且也很容易引入不同主题变量。

## 设置初始化主题

初始化主题设置，只是修改界面默认应用的主题样式。如果不设置默认是 `default` 主题

如果你不想使用多主题方案，则可以在这里设置一个你需要应用的主题。那么页面将应用该主题。

如果用户可以选择多主题，并且用户选择了自己喜欢的主题，每次加载页面，都会先去获取用户选择过的主题，如果没有选择过，则会应用设置的主题。

```js title="/ovine.config.js 编译配置文件"
module.exports = {
  // 默认为 “default”
  initTheme: 'cxd', // 设置 cxd 为初始化主题
}
```

## 项目内写样式

正常使用 `styled components` 包即可。

> 实际上可以不需要时用 `import { css } from 'styled-components'`，因为使用 `css` 会有样式高亮

### 全局样式

```js title="/src/index.js Ovine应用入口"
import { css } from 'styled-components'

export default {
  styled: {
    // highlight-start
    // 全局样式配置。可将 globalStyle 拆为一个单独的文件，更加合理
    globalStyle: css`
      body {
        background: red;
      }
    `,
    // highlight-end
  },
}
```

### 在配置文件中使用

```js
import { css } from 'styled-components'

export default {
  type: 'page',
  // 字符串方式写样式，和写 scss/less 类似
  css: css`
    body {
      background: red;
    }
  `,
  body: '任何内容',
}
```

### 将样式拆为单独文件

```js
// styled.js
export const pageCss = css`
  body {
    background: red;
  }
`

// index.js 配置文件
import { pageCss } from './styled.js'
export default {
  type: 'page',
  // 字符串方式写样式，和写 scss/less 类似
  css: pageCss,
  body: '任何内容',
}
```

### 样式中应用主题

在配置项中可以非常方便的使用主题变量。

```js
// styled.js
export const pageCss = (theme) => css`
  body {
    background: red;
  }

  .${theme.ns}Layout {
    background: blue;
    color: ${theme.colors.text};
  }
`

// index.js 配置文件
import { pageCss } from './styled.js'
export default {
  type: 'page',
  // 字符串方式写样式，和写 scss/less 类似
  css: pageCss,
  body: '任何内容',
}
```

## 修改 `Amis Scss` 主题变量

[所有 Amiss Scss 变量](https://github.com/baidu/amis/blob/master/scss/_variables.scss)

- 新建 `/scss/thems` 目录，在分别建下述主题文件。
- 内置了三个主题变量可供修改
  - `_default.scss` 默认样式
  - `_dark.scss` 暗黑样式
  - `_cxd.scss` 淡雅样式
- 修改对应文件后，需要手动执行 `ovine scss` 进行编译为对应的主题文件。

:::info 提示
执行前 `ovine scss` 命令必须要存在 `node-sass` 依赖包，如有没有需要手动下载，可以全局下载或者下载到当前项目中。
:::

## 添加 `styled` 主题变量

添加 `styled` 主题变量主要是通过入口配置的 `theme` 配置

```js title="/src/index.js Ovine应用入口"
import { AppTheme } from '@core/app/theme'

// 真实应用中可以拆分文件
const appTheme = new AppTheme()

// 此处可更改 内置的变量
appTheme.initThemes({
  default: {
    // 默认主题
    color: 'red',
  },
  cxd: {
    // 淡雅主题
    color: 'blue',
  },
  dark: {
    // 暗黑主题
    color: 'green',
  },
})

export default {
  theme: appTheme,
}
```

## 添加一个全新的主题

默认只有三个主题`default`,`dark`,`cxd`。只能修改对应变量做调整。如果要添加一个全新主题，则需要做一些额外处理。

> 我们以新建一个 `newTheme` 的主题为例

### 配置 `theme`

这一步和编辑`styled`主题变量差不多，只不过是增加一个新 key。

```js title="/src/index.js Ovine应用入口"
import { AppTheme } from '@core/app/theme'

// 真实应用中可以拆分文件
const appTheme = new AppTheme()

// 此处可更改 内置的变量
appTheme.initThemes({
  newTheme: {
    // highlight-start
    // 主题必须的两个参数
    ns: 'nt-',
    name: '新主题',
    // highlight-end
    color: '#000',
  },
})

export default {
  theme: appTheme,
}
```

### 添加 `Amis` 主题，并编译

这一步和修改`Amis Scss`变量差不多，只不是新建一个新文件。

- 在 `/src/scss/` 目录下，新建 `newTheme.scss`
- 编辑 `newTheme.scss` 对应的变量
- 需要手动执行 `ovine scss` 进行编译为对应的主题文件

### 页面中设置为对应的主题

作为上面的步骤之后就有了一个全新的主题，只需要配置对应的主题变量，便可以定制出自己需要的样式了。
