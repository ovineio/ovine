/**
 * 侧边栏
 *
 */

import React from 'react'
import { observer } from 'mobx-react'

import Bar from './bar'
import Panel from './panel'
import Nodes from './nodes'

import { StyledAside, StyledContent } from './styled'

import { AsideProvider, asideStore, useAsideStore } from './store'

const Aside = observer(() => {
  const { isShowPanel, isShowNodes } = useAsideStore()

  return (
    <StyledAside>
      <Bar />
      <StyledContent>
        {!isShowPanel && !isShowNodes && <div>暂无内容</div>}
        {isShowPanel && <Panel />}
        {isShowNodes && <Nodes />}
      </StyledContent>
    </StyledAside>
  )
})

export default () => {
  return (
    <AsideProvider value={asideStore}>
      <Aside />
    </AsideProvider>
  )
}
