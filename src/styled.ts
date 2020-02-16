import { createGlobalStyle, css } from 'styled-components'

// app 全局样式
export const GlobalAppStyle = createGlobalStyle`
  /** 需要用到主题的全局样式 */
  ${({ theme: { ns, colors } }) => css`
    body > div {
      color: ${colors.text};
    }

    .${ns}Chart {
      min-width: 100px !important;
      min-height: 100px !important;
    }

    .${ns}DateRangePicker {
      align-items: center;
    }
  `}

  /** 不需要用到主题的全局样式 */
  .app-root {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: 'opacity' 100ms ease-in;
  }
  
  .theme-is-loading {
    .app-root, .amis-dialog-widget {
      opacity: 0;
    }
  }
  
  .app-tool-tip {
    max-width: unset !important;
  }

  
`
