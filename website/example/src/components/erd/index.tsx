/**
 * 完成可用性功能，再考虑有花需求
 * 1. 添加/编辑/删除 表/字段
 * 2. 存储图信息
 * 3. 连线功能 可设置连线信息/优化连线
 *    3.1 连线模式
 *    3.2 空态
 * 4. 快捷键
 */

import React from 'react'

import Layout from './components/layout'

import { Provider } from './store'

const Erd = () => {
  return (
    <Provider>
      <Layout />
    </Provider>
  )
}

export default Erd
