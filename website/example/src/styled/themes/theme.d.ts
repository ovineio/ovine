import { AppThemeVariable } from '@rtadmin/core/lib/styled/themes/types'

// 定义用到的主题变量
declare module 'styled-components' {
  export interface DefaultTheme extends AppThemeVariable {}
}
