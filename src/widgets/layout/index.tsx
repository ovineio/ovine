/**
 * app主要布局
 */
import React from 'react'

import { useImmer } from '~/utils/hooks'

import Aside from './aside'
import { LayoutState } from './common'
import Header from './header'
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
      folded={asideFolded}
      theme={theme}
      header={<Header {...compProps} />}
      aside={<Aside {...compProps} />}
    >
      {props.children}
    </StyledLayout>
  )
}
