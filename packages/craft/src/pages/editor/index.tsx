import 'jquery.fancytree/dist/skin-win8/ui.fancytree.css'
import 'jquery.fancytree'

import React from 'react'

import Aside from './aside'
import Preview from './preview'
import Reference from './reference'
import { StyledEditor } from './styled'
import TopBar from './topbar'

export default () => {
  return (
    <StyledEditor>
      <TopBar />
      <div className="craft-content">
        <Aside />
        <Preview />
        <Reference />
      </div>
    </StyledEditor>
  )
}
