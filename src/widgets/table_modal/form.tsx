import React from 'react'

export default () => {
  return (
    <div>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6111334333458862"
        data-ad-slot="3820120620"
      />

      <fieldset className="layui-elem-field layui-field-title">
        <legend>初始赋值演示</legend>
      </fieldset>

      <form className="layui-form" action="" lay-filter="example">
        <div className="layui-form-item">
          <label className="layui-form-label">输入框</label>
          <div className="layui-input-block">
            <input
              type="text"
              name="username"
              lay-verify="title"
              placeholder="请输入标题"
              className="layui-input"
            />
          </div>
        </div>
        <div className="layui-form-item">
          <label className="layui-form-label">密码框</label>
          <div className="layui-input-block">
            <input
              type="password"
              name="password"
              placeholder="请输入密码"
              className="layui-input"
            />
          </div>
        </div>

        <div className="layui-form-item">
          <label className="layui-form-label">选择框</label>
          <div className="layui-input-block">
            <select name="interest" lay-filter="aihao">
              <option value="" />
              <option value="0">写作</option>
              <option value="1">阅读</option>
              <option value="2">游戏</option>
              <option value="3">音乐</option>
              <option value="4">旅行</option>
            </select>
          </div>
        </div>

        <div className="layui-form-item">
          <label className="layui-form-label">复选框</label>
          <div className="layui-input-block">
            <input type="checkbox" name="like[write]" title="写作" />
            <input type="checkbox" name="like[read]" title="阅读" />
            <input type="checkbox" name="like[daze]" title="发呆" />
          </div>
        </div>

        <div className="layui-form-item">
          <label className="layui-form-label">开关</label>
          <div className="layui-input-block">
            <input type="checkbox" name="close" lay-skin="switch" lay-text="ON|OFF" />
          </div>
        </div>

        <div className="layui-form-item">
          <label className="layui-form-label">单选框</label>
          <div className="layui-input-block">
            <input type="radio" name="sex" value="男" title="男" />
            <input type="radio" name="sex" value="女" title="女" />
          </div>
        </div>
        <div className="layui-form-item layui-form-text">
          <label className="layui-form-label">文本域</label>
          <div className="layui-input-block">
            <textarea placeholder="请输入内容" className="layui-textarea" name="desc" />
          </div>
        </div>

        <div className="layui-form-item">
          <div className="layui-input-block">
            <button className="layui-btn" lay-submit="" lay-filter="demo1">
              立即提交
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
