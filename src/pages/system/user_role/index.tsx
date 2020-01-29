import React from 'react'

import { Schema } from '~/widgets/amis/schema'

const schema = {
  type: 'page',
  title: '管理员权限',
  remark: '提示 Tip',
  body: '内容部分. 可以使用 \\${var} 获取变量。如: `\\$date`: ${date}',
  aside: '边栏部分',
  toolbar: '工具栏',
  initApi: '/api/mock2/page/initData',
}

export default () => {
  return <Schema schema={schema} />
}
