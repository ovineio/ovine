import React from 'react'
import { renderRoutes } from 'react-router-config'

export default (props: any) => {
  // console.log('layoutProps:', props)
  return (
    <div>
      <div className="layui-layout layui-layout-admin">
        <div className="layui-header">
          <div className="layui-logo">layui 后台布局</div>
          <ul className="layui-nav layui-layout-left">
            <li className="layui-nav-item">
              <a href="">控制台</a>
            </li>
            <li className="layui-nav-item">
              <a href="">商品管理</a>
            </li>
            <li className="layui-nav-item">
              <a href="">用户</a>
            </li>
            <li className="layui-nav-item">
              <a href="javascript:;">其它系统</a>
              <dl className="layui-nav-child">
                <dd>
                  <a href="">邮件管理</a>
                </dd>
                <dd>
                  <a href="">消息管理</a>
                </dd>
                <dd>
                  <a href="">授权管理</a>
                </dd>
              </dl>
            </li>
          </ul>
          <ul className="layui-nav layui-layout-right">
            <li className="layui-nav-item">
              <a href="javascript:;">
                <img src="http://t.cn/RCzsdCq" className="layui-nav-img" />
                贤心
              </a>
              <dl className="layui-nav-child">
                <dd>
                  <a href="">基本资料</a>
                </dd>
                <dd>
                  <a href="">安全设置</a>
                </dd>
              </dl>
            </li>
            <li className="layui-nav-item">
              <a href="">退了</a>
            </li>
          </ul>
        </div>

        <div className="layui-side layui-bg-black">
          <div className="layui-side-scroll">
            <ul className="layui-nav layui-nav-tree" lay-filter="test">
              <li className="layui-nav-item layui-nav-itemed">
                <a className="" href="javascript:;">
                  所有商品
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
        </div>

        <div className="layui-body">
          <div>{renderRoutes(props.route.routes)}</div>
        </div>

        <div className="layui-footer">© layui.com - 底部固定区域</div>
      </div>
    </div>
  )
}
