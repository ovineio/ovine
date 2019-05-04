import React from 'react'
import { StyledAppSide } from './styled'

export default () => {
  return (
    <StyledAppSide className="layui-side layui-bg-black">
      <div className="layui-logo">
        <img src="/static/logo.png" />
        <p>RT-ADMIN</p>
      </div>
      <div className="layui-side-scroll">
        <ul className="layui-nav layui-nav-tree" lay-filter="test">
          <li className="layui-nav-item layui-nav-itemed">
            <a href="javascript:;" lay-tips="主页" lay-direction="2">
              <i className="layui-icon layui-icon-home" />
              <cite>主页</cite>
              <span className="layui-nav-more" />
            </a>
            <dl className="layui-nav-child">
              <dd>
                <a href="javascript:;">列表一</a>
              </dd>
              <dd>
                <a href="javascript:;">列表二</a>
              </dd>
              <dd>
                <a href="javascript:;">列表三</a>
              </dd>
              <dd>
                <a href="">超链接</a>
              </dd>
            </dl>
          </li>
          <li className="layui-nav-item">
            <a href="javascript:;">解决方案</a>
            <dl className="layui-nav-child">
              <dd>
                <a href="javascript:;">列表一</a>
              </dd>
              <dd>
                <a href="javascript:;">列表二</a>
              </dd>
              <dd>
                <a href="">超链接</a>
              </dd>
            </dl>
          </li>
          <li className="layui-nav-item">
            <a href="">云市场</a>
          </li>
          <li className="layui-nav-item">
            <a href="">发布商品</a>
          </li>
        </ul>
      </div>
    </StyledAppSide>
  )
}
