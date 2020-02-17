import { DefaultTheme } from 'styled-components'

export const darkTheme: Types.DeepPartial<DefaultTheme> = {
  ns: 'dark-',
  name: 'dark',
  text: '暗黑主题',
  colors: {
    bodyBg: '#333538',
    text: 'rgb(243, 241, 241)',
    layoutHeaderBg: '#191c22',
    linkHover: '#2296f3',
    border: '#656565',
    echart: [
      '#dd6966',
      '#7699a0',
      '#e79d88',
      '#8ec0aa',
      '#ea7d53',
      '#eddc75',
      '#74a372',
      '#72babc',
      '#7189ac',
      '#90ca8d',
      '#f29f42',
    ],
  },
}
