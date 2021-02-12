/**
 * 完成可用性功能，再考虑有花需求
 * 1. 优化画图模式，全景模式
 *     1. 只读模式， 可选择/移动/搜索， 不可 连线/修改连线/编辑数据/删除/添加/排序
 *     2. 编辑模式 可进行任何操作

 * 2. 优化 保存/发布
 * 3. 添加各种操作提示
 * 3. 前进/后退------ 最后做
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
