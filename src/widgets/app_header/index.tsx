import React from 'react'
import { StyledAppHeader } from './styled'

export const SearchInput = () => {
  return (
    <div className="layui-form" lay-filter="LAY-site-header-component">
      <i className="layui-icon layui-icon-search" />
      <select lay-search="" lay-filter="component">
        <option value="">搜索组件或模块</option>
        <option value="element/layout.html">grid 栅格布局</option>
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
          <input type="text" placeholder="搜索组件或模块" value="" className="layui-input" />
        </div>
        <dl className="layui-anim layui-anim-upbit">
          <dd lay-value="" className="layui-select-tips layui-this">
            搜索组件或模块
          </dd>
          <dd lay-value="element/layout.html" className="">
            grid 栅格布局
          </dd>
          <dd lay-value="element/layout.html#admin" className="">
            admin 后台布局
          </dd>
          <dd lay-value="element/color.html" className="">
            color 颜色
          </dd>
          <dd lay-value="element/icon.html" className="">
            iconfont 字体图标
          </dd>
          <dd lay-value="element/anim.html" className="">
            animation 动画
          </dd>
          <dd lay-value="element/button.html" className="">
            button 按钮
          </dd>
          <dd lay-value="element/form.html" className="">
            form 表单组
          </dd>
          <dd lay-value="element/form.html#input" className="">
            input 输入框
          </dd>
          <dd lay-value="element/form.html#select" className="">
            select 下拉选择框
          </dd>
          <dd lay-value="element/form.html#checkbox" className="">
            checkbox 复选框
          </dd>
          <dd lay-value="element/form.html#switch" className="">
            switch 开关
          </dd>
          <dd lay-value="element/form.html#radio" className="">
            radio 单选框
          </dd>
          <dd lay-value="element/form.html#textarea" className="">
            textarea 文本域
          </dd>
          <dd lay-value="element/nav.html" className="">
            nav 导航菜单
          </dd>
          <dd lay-value="element/nav.html#breadcrumb" className="">
            breadcrumb 面包屑
          </dd>
          <dd lay-value="element/tab.html" className="">
            tabs 选项卡
          </dd>
          <dd lay-value="element/progress.html" className="">
            progress 进度条
          </dd>
          <dd lay-value="element/collapse.html" className="">
            collapse 折叠面板/手风琴
          </dd>
          <dd lay-value="element/table.html" className="">
            table 表格元素
          </dd>
          <dd lay-value="element/badge.html" className="">
            badge 徽章
          </dd>
          <dd lay-value="element/timeline.html" className="">
            timeline 时间线
          </dd>
          <dd lay-value="element/auxiliar.html#blockquote" className="">
            blockquote 引用块
          </dd>
          <dd lay-value="element/auxiliar.html#fieldset" className="">
            fieldset 字段集
          </dd>
          <dd lay-value="element/auxiliar.html#hr" className="">
            hr 分割线
          </dd>
          <dd lay-value="modules/layer.html" className="">
            layer 弹出层/弹窗综合
          </dd>
          <dd lay-value="modules/laydate.html" className="">
            laydate 日期时间选择器
          </dd>
          <dd lay-value="modules/layim.html" className="">
            layim 即时通讯/聊天
          </dd>
          <dd lay-value="modules/laypage.html" className="">
            laypage 分页
          </dd>
          <dd lay-value="modules/laytpl.html" className="">
            laytpl 模板引擎
          </dd>
          <dd lay-value="modules/form.html" className="">
            form 表单模块
          </dd>
          <dd lay-value="modules/table.html" className="">
            table 数据表格
          </dd>
          <dd lay-value="modules/upload.html" className="">
            upload 文件/图片上传
          </dd>
          <dd lay-value="modules/element.html" className="">
            element 常用元素操作
          </dd>
          <dd lay-value="modules/rate.html" className="">
            rate 评分
          </dd>
          <dd lay-value="modules/colorpicker.html" className="">
            colorpicker 颜色选择器
          </dd>
          <dd lay-value="modules/slider.html" className="">
            slider 滑块
          </dd>
          <dd lay-value="modules/carousel.html" className="">
            carousel 轮播/跑马灯
          </dd>
          <dd lay-value="modules/layedit.html" className="">
            layedit 富文本编辑器
          </dd>
          <dd lay-value="modules/tree.html" className="">
            tree 树形菜单
          </dd>
          <dd lay-value="modules/flow.html" className="">
            flow 信息流/图片懒加载
          </dd>
          <dd lay-value="modules/util.html" className="">
            util 工具集
          </dd>
          <dd lay-value="modules/code.html" className="">
            code 代码修饰
          </dd>
        </dl>
      </div>
    </div>
  )
}

export default () => {
  return (
    <StyledAppHeader className="layui-header">
      <div className="layui-logo">
        <img src="/static/logo.png" />
        <p>RT-ADMIN</p>
      </div>
      <div className="layui-layout-left">
        <div className="layui-breadcrumb">
          <a href="">首页</a>
          <a href="">国际新闻</a>
          <a href="">亚太地区</a>
          <a>
            <cite>正文</cite>
          </a>
        </div>
      </div>
      <div className="layui-layout-right">
        <SearchInput />
        <ul className="layui-nav">
          <li className="layui-nav-item">
            <a href="">更新日志</a>
          </li>
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
