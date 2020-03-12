/**
 * App布局
 */

import { Layout } from 'amis'
import React from 'react'

import { withAppTheme } from '@/app/theme'
import { useImmer } from '@/utils/hooks'

import Aside from './aside'
import Header from './header'
import { LayoutLoading } from './loading'
import { StyledLayout } from './styled'
import { LayoutState } from './types'

type Props = {
  children: any
}

const initState = {
  asideFolded: false,
  offScreen: false,
  headerVisible: false,
}

export default withAppTheme<Props>((props) => {
  const [state, setState] = useImmer<LayoutState>(initState)

  const { asideFolded, offScreen } = state

  const compProps = { ...state, setLayout: setState }

  const theme = props.theme.name

  return (
    <StyledLayout>
      <Layout
        headerFixed
        contentClassName="app-layout-body"
        theme={theme}
        folded={asideFolded}
        offScreen={offScreen}
        header={<Header {...compProps} />}
        aside={<Aside {...compProps} />}
      >
        <LayoutLoading theme={theme} />
        {props.children}
      </Layout>
    </StyledLayout>
  )
})
