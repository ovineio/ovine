import React from 'react'

import { ids } from '@constants/layui'

import { StyledAppHeader } from './styled'

export const SearchInput = () => {
  return (
    <div className="layui-form" lay-filter="LAY-site-header-component">
      <i className="layui-icon layui-icon-search" />
      <select lay-search="" lay-filter="component">
        <option value="">搜索组件或模块</option>
        <option value="element/layout.html">grid 栅x格布局</option>
        <option value="element/layout.html#admin">admin 后台布局</option>
        <option value="element/color.html">color 颜色</option>
        <option value="element/icon.html">iconfont 字体图标</option>
        <option value="element/anim.html">animation 动画</option>
        <option value="element/button.html">button 按钮</option>
        <option value="element/form.html">form 表单组</option>
        <option value="element/form.html#input">input 输入框</option>
        <option value="element/form.html#select">select 下拉选择框</option>
        <option value="element/form.html#checkbox">checkbox 复选框</option>
        <option value="element/form.html#switch">switch 开关</option>
        <option value="element/form.html#radio">radio 单选框</option>
        <option value="element/form.html#textarea">textarea 文本域</option>
        <option value="element/nav.html">nav 导航菜单</option>
        <option value="element/nav.html#breadcrumb">breadcrumb 面包屑</option>
        <option value="element/tab.html">tabs 选项卡</option>
        <option value="element/progress.html">progress 进度条</option>
        <option value="element/collapse.html">collapse 折叠面板/手风琴</option>
        <option value="element/table.html">table 表格元素</option>
        <option value="element/badge.html">badge 徽章</option>
        <option value="element/timeline.html">timeline 时间线</option>
        <option value="element/auxiliar.html#blockquote">blockquote 引用块</option>
        <option value="element/auxiliar.html#fieldset">fieldset 字段集</option>
        <option value="element/auxiliar.html#hr">hr 分割线</option>
        <option value="modules/layer.html">layer 弹出层/弹窗综合</option>
        <option value="modules/laydate.html">laydate 日期时间选择器</option>
        <option value="modules/layim.html">layim 即时通讯/聊天</option>
        <option value="modules/laypage.html">laypage 分页</option>
        <option value="modules/laytpl.html">laytpl 模板引擎</option>
        <option value="modules/form.html">form 表单模块</option>
        <option value="modules/table.html">table 数据表格</option>
        <option value="modules/upload.html">upload 文件/图片上传</option>
        <option value="modules/element.html">element 常用元素操作</option>
        <option value="modules/rate.html">rate 评分</option>
        <option value="modules/colorpicker.html">colorpicker 颜色选择器</option>
        <option value="modules/slider.html">slider 滑块</option>
        <option value="modules/carousel.html">carousel 轮播/跑马灯</option>
        <option value="modules/layedit.html">layedit 富文本编辑器</option>
        <option value="modules/tree.html">tree 树形菜单</option>
        <option value="modules/flow.html">flow 信息流/图片懒加载</option>
        <option value="modules/util.html">util 工具集</option>
        <option value="modules/code.html">code 代码修饰</option>
      </select>
      <div className="layui-form-select layui-form-selected">
        <div className="layui-select-title">
          <input type="text" placeholder="搜索组件或模块" className="layui-input" />
        </div>
      </div>
    </div>
  )
}

export default () => {
  return (
    <StyledAppHeader className="layui-header">
      <ul className="layui-nav layui-layout-left">
        <li className="layui-nav-item rtadmin-flexible" lay-unselect="">
          <a href="javascript:;" rtadmin-event="flexible" title="侧边伸缩">
            <i className="layui-icon layui-icon-shrink-right" id={ids.app_flexible} />
          </a>
        </li>
        <li className="layui-nav-item layui-hide-xs" lay-unselect="">
          <a href="http://www.layui.com/admin/" target="_blank" title="前台">
            <i className="layui-icon layui-icon-screen-full" />
          </a>
        </li>
        <li className="layui-nav-item" lay-unselect="">
          <a href="javascript:;" rtadmin-event="refresh" title="刷新">
            <i className="layui-icon layui-icon-refresh-3" />
          </a>
        </li>
        <li className="layui-nav-item layui-hide-xs" lay-unselect="">
          <SearchInput />
        </li>
      </ul>
      <div className="layui-layout-right">
        <ul className="layui-nav">
          <li className="layui-nav-item">
            <a href="">更新日志</a>
          </li>
          <li className="layui-nav-item">
            <a href="javascript:;">贤心</a>
            <dl className="layui-nav-child">
              <dd>
                <a href="">基本资料</a>
              </dd>
              <dd>
                <a href="">安全设置</a>
              </dd>
              <dd>
                <a href="">退出登录</a>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
    </StyledAppHeader>
  )
}
