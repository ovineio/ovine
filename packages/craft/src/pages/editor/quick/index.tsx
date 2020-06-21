/**
 * 快速操作区
 */

import React from 'react'

import { StyledQuick } from './styled'

export default () => {
  return (
    <StyledQuick>
      <ul>
        <li data-tooltip="内置组件" data-position="left">
          <i className="fa fa-code" />
        </li>
        <li data-tooltip="我的模版" data-position="left">
          <i className="fa fa-code" />
        </li>
        <li data-tooltip="图标" data-position="left">
          <i className="fa fa-code" />
        </li>
        <li data-tooltip="预设" data-position="left">
          <i className="fa fa-code" />
        </li>
      </ul>
    </StyledQuick>
  )
}
