/**
 * App布局
 * TODO: 将 Layout, HeaderItem, Aside 定义为 amis 组件
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

  const { asideFolded, offScreen } = state

  const compProps = { ...state, setLayout: setState }

  return (
    <StyledLayout>
      <Layout
        headerFixed
        contentClassName="app-layout-body"
        theme={props.theme.name}
        folded={asideFolded}
        offScreen={offScreen}
        header={<Header {...compProps} />}
        aside={<Aside {...compProps} />}
      >
        <LayoutLoading />
        {props.children}
      </Layout>
    </StyledLayout>
  )
})
