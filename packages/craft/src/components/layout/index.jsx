/**
 * 布局
 */

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import Preview from '@/components/preview'
import Header from '@/components/header'
import Aside from '@/components/aside'
import Reference from '@/components/reference'

import { RootProvider, getRootStore } from '@/stores'

import { StyledLayout, StyledContent } from './styled'

export default observer(() => {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        <Aside />
        <Preview />
        <Reference />
      </StyledContent>
    </StyledLayout>
  )
})
