/**
 * 顶部工具栏
 */

import React from 'react'

import { StyledHeader } from './styled'

export default () => {
  return (
    <StyledHeader>
      <ul>
        <li>预览</li>
        <li>退出预览</li>
        <li>撤销</li>
        <li>恢复撤销</li>
      </ul>
    </StyledHeader>
  )
}
