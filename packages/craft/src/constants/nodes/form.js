const refProps = {
  base: [
    {
      type: 'button-group',
      name: 'mode',
      label: '类型',
      value: 'json',
      options: [
        {
          label: '一般',
          value: 'normal',
        },
        {
          label: '横向',
          value: 'horizontal',
        },
        {
          label: '内联',
          value: 'inline',
        },
      ],
    },
    {
      name: 'title',
      label: '标题',
      type: 'text',
    },
    {
      name: 'wrapWithPanel',
      label: '是否需要面板',
      type: 'switch',
    },
    {
      name: 'submitText',
      label: '提交按钮文案',
      type: 'text',
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

export default {
  refProps,
  selectProps,
}
