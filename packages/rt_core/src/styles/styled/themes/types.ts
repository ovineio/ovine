export interface AppThemeVariable {
  ns: string
  name: string
  text: string
  // 颜色
  colors: {
    echart: string[]
    bodyBg: string
    text: string
    layoutHeaderBg: string
    linkHover: string
    border: string
  }
}