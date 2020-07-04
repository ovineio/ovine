import React from 'react'

// import { QueryMethods } from '@/editor/query'
// import { useInternalEditor } from '@/editor/use_internal_editor'
// import { QueryCallbacksFor } from '@/utils/use_methods'

import { Nodes, NodeEvents, NodeId } from './nodes'

// 编辑器选项
export type Options = {
  onRender: React.ComponentType<{ render: React.ReactElement }> // 渲染回调
  // onNodesCshange: (query: QueryCallbacksFor<typeof QueryMethods>) => void // 节点变化
  resolver: Resolver // 解析器
  enabled: boolean // 是否禁用
}

// 编辑器布局
export type Layout = {
  unfoldCode: boolean // 展开 code 代码编辑
  unfoldReference: boolean // 展开属性关联
  referencePosition: 'aside' | 'bottom' // 侧边展示
  previewPosition: 'left' | 'center' | 'right' // 预览展示区 左中右
}

export type Resolver = Record<string, string | React.ElementType>

export type EditorEvents = Record<NodeEvents, NodeId | null>

export type EditorState = {
  nodes: Nodes // 所有的节点
  events: EditorEvents // 事件
  options: Options // 选项
  layout: Layout // 布局内容
  schema: any // 实时预览的 schema
}
