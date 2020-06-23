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
          <i className="fa fa-desktop" />
          <span>页面大小</span>
        </li>
        <li className="tool-item" data-tooltip="cmd + z" data-position="bottom">
          <i className="fa fa-undo" />
          <span>撤销</span>
        </li>
        <li className="tool-item" data-tooltip="shift + cmd + z" data-position="bottom">
          <i className="fa fa-repeat" />
          <span>重做</span>
        </li>
        <li className="tool-item" data-tooltip="cmd + p" data-position="bottom">
          <i className="fa fa-play-circle-o" />
          <span>预览</span>
        </li>
        <li className="tool-item" data-tooltip="cmd + s" data-position="bottom">
          <i className="fa fa-code" />
          <span>代码模式</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-check-square-o" />
          <span>发布</span>
        </li>
        <li className="tool-item" data-tooltip="cmd + s" data-position="bottom">
          <i className="fa fa-cloud-upload" />
          <span>保存</span>
        </li>
        <li className="tool-item">
          <i className="fa fa-ellipsis-v" />
          <span>更多</span>
        </li>
      </ul>
    </StyledTopBar>
  )
}
