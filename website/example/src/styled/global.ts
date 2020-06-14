// 全局样式

import { DefaultTheme, css } from 'styled-components'

// styled-components 文档 https://styled-components.com/, 介绍文章 https://www.jianshu.com/p/2178abb2ee95
// 需要下载 编辑器对应的 styled-components 插件，支持高亮，样式写法与 scss 类似
// theme 能获取到所有 styled/themes 定义的主题变量， css 是用于高亮显示与智能提示的

// 全局样式, 这里和 scss 类似支持嵌套，与styled变量，
// 以下用作举例：
export default (theme: DefaultTheme) => css`
  .${theme.ns}Layout {
    background-color: transparent;
  }
`
