/**
 * 头部区域
 */
import React from 'react'

import { StyledTopBar } from './styled'

export default () => {
  return (
    <StyledTopBar>
      <div className="brand">Ovine 编辑器</div>
      <ul className="left">
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>页面大小</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>撤销</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>重做</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>预览</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>发布</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>保存</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-code" />
          <span>更多</span>
        </li>
      </ul>
    </StyledTopBar>
  )
}
