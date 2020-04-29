import { AppThemeVariable } from '@core/styled/themes/types'

// 定义用到的主题变量
declare module 'styled-components' {
  export interface DefaultTheme extends AppThemeVariable {}
}
