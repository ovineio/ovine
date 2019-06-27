import React from 'react'

import TableView from '@widgets/table_view'
import { TableViewProps } from '@widgets/table_view/types'

export default () => {
  const tableProps: TableViewProps = {
    cols: [
      [
        {
          field: 'user_id',
          title: '用户ID',
        },
        {
          field: 'nick_name',
          title: '用户昵称',
        },
        {
          field: 'avatar',
          title: '头像',
        },
        {
          field: 'limit_id',
          title: '权限ID',
        },
      ],
    ],
    id: 'demo',
    request: {
      api: '/admin_user/list',
      isMock: true,
    },
    page: {
      limit: 10,
    },
    toolbar: `
      <div class="layui-btn-container">
        <button class="layui-btn layui-btn-sm" lay-event="add">添加</button>
        <button class="layui-btn layui-btn-sm" lay-event="delete">删除</button>
        <button class="layui-btn layui-btn-sm" lay-event="update">编辑</button>
      </div>
    `,
    onToolbar(data: any) {
      // console.log('data', data)
      //
    },
  }
  return <TableView {...tableProps} />
}
