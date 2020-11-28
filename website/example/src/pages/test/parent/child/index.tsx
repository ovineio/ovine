export const schema = {
  type: 'page',
  title: '父子页面权限隔离',
  body: {
    type: 'wrapper',
    body: [
      {
        type: 'alert',
        body: '子页面可单独设置权限，与父页面独立。',
      },
      {
        limits: 'set',
        type: 'action',
        className: 'm-r-md',
        level: 'primary',
        label: '子页面权限-设置',
        tooltip: '仅用于权限测试，没有什么功能',
      },
      {
        limits: 'del',
        type: 'action',
        level: 'danger',
        label: '子页面权限-删除',
        tooltip: '仅用于权限测试，没有什么功能',
      },
    ],
  },
}
