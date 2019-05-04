import React from 'react'
import { StyledRouteTabs } from './styled'

export default () => {
  return (
    <StyledRouteTabs id="LAY_app_tabs">
      <div className="layui-icon layadmin-tabs-control layui-icon-prev" layadmin-event="leftPage" />
      <div
        className="layui-icon layadmin-tabs-control layui-icon-next"
        layadmin-event="rightPage"
      />
      <div className="layui-icon layadmin-tabs-control layui-icon-down">
        <ul className="layui-nav layadmin-tabs-select" lay-filter="layadmin-pagetabs-nav">
          <li className="layui-nav-item" lay-unselect="">
            <a href="javascript:;">
              <span className="layui-nav-more" />
            </a>
            <dl className="layui-nav-child layui-anim-fadein layui-anim layui-anim-upbit">
              <dd layadmin-event="closeThisTabs">
                <a href="javascript:;">关闭当前标签页</a>
              </dd>
              <dd layadmin-event="closeOtherTabs">
                <a href="javascript:;">关闭其它标签页</a>
              </dd>
              <dd layadmin-event="closeAllTabs">
                <a href="javascript:;">关闭全部标签页</a>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <div
        className="layui-tab"
        lay-unauto=""
        lay-allowclose="true"
        lay-filter="layadmin-layout-tabs"
      >
        <ul className="layui-tab-title" id="LAY_app_tabsheader">
          <li lay-id="home/console.html" lay-attr="home/console.html">
            <i className="layui-icon layui-icon-home" />
            <i className="layui-icon layui-unselect layui-tab-close">ဆ</i>
          </li>
          <li
            lay-id="component/grid/mobile.html"
            lay-attr="component/grid/mobile.html"
            className="layui-this"
          >
            <span>按移动端排列</span>
            <i className="layui-icon layui-unselect layui-tab-close">ဆ</i>
          </li>
          <li lay-id="component/grid/mobile.html" lay-attr="component/grid/mobile.html">
            <span>按移动端排列</span>
            <i className="layui-icon layui-unselect layui-tab-close">ဆ</i>
          </li>
        </ul>
      </div>
    </StyledRouteTabs>
  )
}
