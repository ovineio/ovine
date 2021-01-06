import { DefaultTheme } from 'styled-components'

import * as Types from '@/utils/types'

export const cxdTheme: Types.DeepPartial<DefaultTheme> = {
  ns: 'cxd-',
  name: 'cxd',
  text: '淡雅主题',
  colors: {
    bodyBg: '#fff',
    text: '#666',
    layoutHeaderBg: '#f5f5f5',
    linkHover: 'rgb(18, 140, 238)',
    border: '#e8ebee',
    // echart: [
    //   '#36a2db',
    //   '#31c5e8',
    //   '#65e0e3',
    //   '#a1e6b9',
    //   '#ffdb58',
    //   '#ff9f7e',
    //   '#fb7293',
    //   '#df62ad',
    //   '#e790d2',
    //   '#e5bcf4',
    //   '#9d95f5',
    //   '#8378ea',
    //   '#95bfff',
    // ],
  },
}
