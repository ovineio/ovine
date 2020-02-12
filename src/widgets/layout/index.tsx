/**
 * App布局
 */

import { Layout } from 'amis'
import React from 'react'

import { withAppTheme } from '~/theme'
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
}

export default withAppTheme<Props>((props) => {
  const [state, setState] = useImmer<LayoutState>(initState)

  const { asideFolded } = state

  const compProps = { ...state, setLayout: setState }

  // TODO: Layout 作为一个 自定义组件
  return (
    <StyledLayout>
      <Layout
        headerFixed
        theme={props.theme.name}
        folded={asideFolded}
        contentClassName="app-layout-body"
        header={<Header {...compProps} />}
        aside={<Aside {...compProps} />}
      >
        <LayoutLoading />
        {props.children}
      </Layout>
    </StyledLayout>
  )
})
