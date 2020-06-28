/**
 * 目录快速索引区
 */
import React from 'react'

import { StyledAside } from './styled'
import Tabs from './tabs'
import Tree from './tree'

export default () => {
  return (
    <StyledAside>
      <Tabs />
      <Tree />
    </StyledAside>
  )
}
