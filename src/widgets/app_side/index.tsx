import React from 'react'

export default () => {
  return (
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
  )
}
