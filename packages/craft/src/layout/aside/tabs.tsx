/**
 * 目录快速索引区
 */
import React from 'react'

import { StyledTabs } from './styled'

export default () => {
  return (
    <StyledTabs>
      <ul>
        <li data-tooltip="内置组件" data-position="right">
          <i className="fa fa-cube" />
        </li>
        <li data-tooltip="我的模版" data-position="right">
          <i className="fa fa-tachometer" />
        </li>
        <li data-tooltip="图标" data-position="right">
          <i className="fa fa-rocket" />
        </li>
        <li data-tooltip="预设" data-position="right">
          <i className="fa fa-puzzle-piece" />
        </li>
      </ul>

      <ul>
        <li data-tooltip="组件" data-position="right">
          <i className="fa fa-cube" />
        </li>
        <li data-tooltip="表单" data-position="right">
          <i className="fa fa-wpforms" />
        </li>
        <li data-tooltip="权限" data-position="right">
          <i className="fa fa-unlock-alt" />
        </li>
        <li data-tooltip="操作" data-position="right">
          <i className="fa fa-bolt" />
        </li>
      </ul>
    </StyledTabs>
  )
}
