/**
 * 内容面板
 */

import React from 'react'

import Containers from './container/'

import { StyledPanel } from './styled'

export default () => {
  const Container = Containers.Page

  return (
    <StyledPanel>
      <Container />
    </StyledPanel>
  )
}
