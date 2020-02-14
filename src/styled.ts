import { createGlobalStyle } from 'styled-components'

/* ${({ theme: { ns } }) => css`
    //
`} */
// app 全局样式
export const GlobalAppStyle = createGlobalStyle`
  /** 需要用到主题的全局样式 */
  

  /** 不需要用到主题的全局样式 */
  #app-root {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .app-tool-tip {
    max-width: unset !important;
  }
`
