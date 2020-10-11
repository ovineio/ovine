import { mapTree } from 'amis/lib/utils/helper'
import { get } from 'lodash'

import { nodes } from '@/constants'

const nodesConfig = [
  {
    type: 'functions',
    label: '功能',
    icon: 'windows',
    children: [
      {
        parent: 'functions',
        type: 'action',
      },
      {
        type: 'a2',
        parent: 'functions',
        label: '按钮',
        desc: '按钮按钮按钮按钮按钮按钮按钮按钮按钮按钮按钮按钮',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
    ],
  },
  {
    type: 'containers',
    label: '容器',
    icon: 'windows',
    children: [
      {
        type: 'a3',
        parent: 'containers',
        label: '增删改查',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
      {
        type: 'b1',
        parent: 'containers',
        label: '按钮',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
    ],
  },
  {
    type: 'buttons',
    label: '按钮',
    icon: 'windows',
    children: [
      {
        type: 'b2',
        parent: 'buttons',
        label: '增删改查',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
      {
        type: 'c1',
        label: '按钮',
        parent: 'buttons',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
    ],
  },
  {
    type: 'display',
    label: '展示',
    icon: 'windows',
    children: [
      {
        type: 'c2',
        parent: 'display',
        label: '增删改查',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
      {
        type: 'd1',
        parent: 'display',
        label: '按钮',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
    ],
  },
  {
    type: 'others',
    label: '其他',
    icon: 'windows',
    children: [
      {
        type: 'd2',
        parent: 'others',
        label: '增删改查',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
      {
        type: 'e1',
        parent: 'others',
        label: '按钮',
        desc: '增删改查增删改查增删改查增删改查增删改查增删改查',
        img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
      },
    ],
  },
]

const config = mapTree(nodesConfig, (item) => {
  const { parent, type } = item

  if (!parent) {
    return item
  }

  const nodeInfo = get(nodes, `${type}.selectorInfo`)

  if (!nodeInfo) {
    return item
  }

  return {
    ...item,
    ...nodeInfo,
  }
})

export default config
