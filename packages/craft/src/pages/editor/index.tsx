import React from 'react'

import Aside from './aside'
import Preview from './preview'
import Quick from './quick'
import Reference from './reference'
import { StyledEditor } from './styled'
import TopBar from './topbar'

export default () => {
  return (
    <StyledEditor>
      <TopBar />
      <Quick />
      <div className="craft-content">
        <Aside />
        <Preview />
        <Reference />
      </div>
    </StyledEditor>
  )
}
