/**
 * 布局
 */

import { observer } from 'mobx-react'
import React from 'react'

import Aside from '@/components/aside'
import Header from '@/components/header'
import Preview from '@/components/preview'
import Reference from '@/components/reference'
import Selector from '@/components/selector'
import history from '@/stores/history'

import { StyledLayout, StyledContent } from './styled'

export default observer(() => {
  return (
    <StyledLayout>
      <Header history={history} />
      <StyledContent>
        <Aside />
        <Preview />
        <Reference />
      </StyledContent>
      <Selector />
    </StyledLayout>
  )
})
