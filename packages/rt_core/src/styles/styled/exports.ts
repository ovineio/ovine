/**
 * theme相关的工具方法
 */

import { FunctionComponent } from 'react'
import { withTheme, DefaultTheme } from 'styled-components'

import { storage } from '@/constants'
import { getStore } from '@/utils/store'

import themes from './themes'

export const getAllThemes = () => {
  return themes
}

export const getTheme = () => ({
  name: 'default',
  ...getAllThemes()[getStore<string>(storage.appTheme) || 'default'],
})

export const registerTheme = () => {
  //
}

// 重写 withTheme 类型
type WithAppTheme = <P, C = FunctionComponent<P & { theme: DefaultTheme }>>(
  component: C
) => FunctionComponent<P>

export const withAppTheme: WithAppTheme = withTheme as any
