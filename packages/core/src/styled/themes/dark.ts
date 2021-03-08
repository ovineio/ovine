import { DefaultTheme } from 'styled-components'

import { DeepPartial } from '@/utils/types'

export const darkTheme: DeepPartial<DefaultTheme> = {
  ns: 'dark-',
  name: 'dark',
  text: '暗黑主题',
  colors: {
    bodyBg: '#333538',
    text: 'rgb(243, 241, 241)',
    layoutHeaderBg: '#191c22',
    linkHover: '#2296f3',
    border: '#656565',
  },
}
