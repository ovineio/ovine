import React, { useEffect } from 'react'

export default () => {
  useEffect(() => {
    layui.use('table', () => {
      //
    })
  }, [])

  return (
    <table
      className="layui-table"
      lay-data="{height: 'full-200', cellMinWidth: 80, page: true, limit:30, url:'/demo/table/user/'}"
    >
      <thead>
        <tr>
          <th lay-data="{type:'checkbox'}">IDS</th>
          <th lay-data="{field:'id', width:100, sort: true}">IDS</th>
          <th lay-data="{field:'username', width:100}">用户名123</th>
          <th lay-data="{field:'sex', width:100, sort: true}">性别</th>
          <th lay-data="{field:'sign', minWidth: 150}">签名</th>
          <th lay-data="{field:'experience', sort: true, align: 'right'}">积分</th>
          <th lay-data="{field:'score', sort: true, minWidth: 100, align: 'right'}">评分</th>
        </tr>
      </thead>
    </table>
  )
}
