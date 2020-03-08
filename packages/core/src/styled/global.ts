import isFunction from 'lodash/isFunction'
import { createGlobalStyle, css, DefaultTheme } from 'styled-components'

const getSiteGlobalStyle = (props: DefaultTheme) => {
  try {
    const siteStyle = require('~/app/styles/styled/global.ts')

    return !isFunction(siteStyle) ? siteStyle : siteStyle(props)
  } catch (_) {
    //
  }

  return undefined
}

// 全局样式
const GlobalStyle = createGlobalStyle`
  /** lib 全局样式 */
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

  /** lib 主题相关的全局样式 */
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

  /** site 全局样式 */
  ${({ theme }) => getSiteGlobalStyle(theme)}
`

export default GlobalStyle
