/**
 * 布局
 */

import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import cls from 'classnames'

import Preview from '@/components/preview'
import Header from '@/components/header'
import Aside from '@/components/aside'
import Reference from '@/components/reference'
import Stage from '@/components/stage'
import history from '@/stores/history'

import { RootProvider, useRootStore } from '@/stores'

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
    </StyledLayout>
  )
})
