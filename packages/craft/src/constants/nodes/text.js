const refProps = {
  base: [
    {
      name: 'name',
      label: '字段名',
      type: 'text',
    },
    {
      name: 'label',
      label: '文本',
      type: 'text',
    },
    {
      name: 'description',
      label: '描述',
      type: 'text',
    },
    {
      name: 'hint',
      label: '输入提示',
      type: 'text',
    },
    // {
    //   type: 'select',
    //   name: 'level',
    //   label: '类型',
    //   value: 'default',
    //   options: [
    //     {
    //       label: '一般',
    //       value: 'default',
    //     },
    //     {
    //       label: '主要',
    //       value: 'primary',
    //     },
    //     {
    //       label: '侧次要',
    //       value: 'secondary',
    //     },
    //   ],
    // },
    // {
    //   type: 'select',
    //   name: 'size',
    //   label: '大小',
    //   value: 'md',
    //   options: [
    //     {
    //       label: '一般',
    //       value: 'md',
    //     },
    //     {
    //       label: '小',
    //       value: 'sm',
    //     },
    //     {
    //       label: '大',
    //       value: 'lg',
    //     },
    //     {
    //       label: '超小',
    //       value: 'xs',
    //     },
    //   ],
    // },
    // {
    //   name: 'active',
    //   label: '是否高亮',
    //   type: 'switch',
    // },
    // {
    //   name: 'block',
    //   label: '是否Block显示',
    //   type: 'switch',
    // },
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

export default {
  refProps,
  selectProps,
}
