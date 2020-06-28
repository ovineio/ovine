/**
 * 代码编辑器区域
 */

import { Editor } from 'amis/lib/components'
import React from 'react'

import { StyledCode } from './styled'

const editorOptions = {
  tabSize: 2,
}

export default () => {
  return (
    <StyledCode>
      <Editor editorTheme="vs" language="javascript" options={editorOptions} />
    </StyledCode>
  )
}
