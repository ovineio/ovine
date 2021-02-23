/**
 * 完成可用性功能，再考虑优化需求
 * 1. 添加各种操作提示
 * 2. 优化 保存/发布
 * 3. 前进/后退------ 最后做
 * 4. 添加快捷键支持
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
