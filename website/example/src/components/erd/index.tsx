/**
 * 完成可用性功能，再考虑有花需求
 * 1. 优化添加全景模式
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
