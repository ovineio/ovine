const refProps = {
  base: [
    {
      name: 'label',
      label: '按钮文本',
      type: 'text',
    },
    {
      type: 'select',
      name: 'level',
      label: '类型',
      value: 'default',
      options: [
        {
          label: '一般',
          value: 'default',
        },
        {
          label: '主要',
          value: 'primary',
        },
        {
          label: '侧次要',
          value: 'secondary',
        },
      ],
    },
    {
      type: 'select',
      name: 'size',
      label: '大小',
      value: 'md',
      options: [
        {
          label: '一般',
          value: 'md',
        },
        {
          label: '小',
          value: 'sm',
        },
        {
          label: '大',
          value: 'lg',
        },
        {
          label: '超小',
          value: 'xs',
        },
      ],
    },
    {
      name: 'active',
      label: '是否高亮',
      type: 'switch',
    },
    {
      name: 'block',
      label: '是否Block显示',
      type: 'switch',
    },
  ],
  ui: [
    {
      type: 'text',
      name: 'className',
      label: 'ClassName',
    },
  ],
  advance: [
    {
      type: 'text',
      name: 'name',
      label: '名字',
    },
  ],
}

const selectProps = {}

const selectorInfo = {
  type: 'action',
  label: '按钮',
  img: 'https://img.alicdn.com/tfs/TB1SSZAMkY2gK0jSZFgXXc5OFXa-162-72.png',
  desc: '用来展示一个按钮，你可以配置不同的展示样式，配置不同的点击行为',
  template: {
    type: 'action',
    label: '按钮',
  },
}

export default {
  refProps,
  selectProps,
  selectorInfo,
}
