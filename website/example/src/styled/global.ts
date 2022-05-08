// 全局样式

import { DefaultTheme, css } from 'styled-components'

import { asideCss } from './aside'

// styled-components 文档 https://styled-components.com/, 介绍文章 https://www.jianshu.com/p/2178abb2ee95
// 需要下载 编辑器对应的 styled-components 插件，支持高亮，样式写法与 scss 类似
// theme 能获取到所有 styled/themes 定义的主题变量， css 是用于高亮显示与智能提示的

// 全局样式, 这里和 scss 类似支持嵌套，与styled变量，
// 以下用作举例：
export default ({ ns }: DefaultTheme) => css`
  ${asideCss};

  .w-md {
    width: 240px !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cxd-Table-table {
    border: 0 !important;
  }
  .table-cell-image {
    .${ns}Image-thumb {
      width: 50px;
      height: 50px;
      padding: 0;
      &-thumb {
        overflow: inherit;
        height: 100%;
      }
    }
  }
  .${ns}Layout {
    background-color: transparent;
  }
  .${ns}Table-table > tbody > tr > td,
  .${ns}Table-table > tbody > tr > th {
    vertical-align: middle;
  }

  .${ns}Table {
    &-content {
      border-radius: var(--Button--sm-borderRadius);
    }
  }
  .${ns}ContextMenu-item {
    &.active {
      background-color: #3590dc;
      color: #fff;
    }
  }
`
