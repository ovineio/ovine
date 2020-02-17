/**
 * theme相关的工具方法
 */

import { FunctionComponent } from 'react'
import { withTheme, DefaultTheme } from 'styled-components'

import { appTheme } from '~/constants/store_key'
import themes from '~/constants/themes'
import { getStore } from '~/utils/store'

export const getAppTheme = () => ({
  name: 'default',
  ...themes[getStore<string>(appTheme) || 'default'],
})

// 重写 withTheme 类型
type WithAppTheme = <P, C = FunctionComponent<P & { theme: DefaultTheme }>>(
  component: C
) => FunctionComponent<P>

export const withAppTheme: WithAppTheme = withTheme as any
