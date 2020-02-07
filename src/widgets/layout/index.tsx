/**
 * App布局
 */

import { AlertComponent, ToastComponent } from 'amis'
import React from 'react'

import { useImmer } from '~/utils/hooks'

import Aside from './aside'
import { LayoutState } from './common'
import Header from './header'
import { LayoutLoading } from './loading'
import { StyledLayout } from './styled'

type Props = {
  children: any
}

const initState = {
  asideFolded: false,
  offScreen: false,
  headerVisible: false,
  theme: 'default',
}

export default (props: Props) => {
  const [state, setState] = useImmer<LayoutState>(initState)
  const { theme, asideFolded } = state

  const compProps = { ...state, setLayout: setState }

  return (
    <StyledLayout
      headerFixed
      theme={theme}
      folded={asideFolded}
      contentClassName="app-layout-body"
      header={<Header {...compProps} />}
      aside={<Aside {...compProps} />}
    >
      <LayoutLoading />
      <ToastComponent theme={theme} />
      <AlertComponent theme={theme} />
      {props.children}
    </StyledLayout>
  )
}
