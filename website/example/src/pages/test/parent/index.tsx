export const schema = {
  type: 'page',
  title: '允许侧边栏父级别页面',
  body: {
    type: 'wrapper',
    body: [
      {
        type: 'alert',
        body: '当 父/子 同时存在时，可分别独立设置，两个页面权限，互不影响。',
      },
      {
        limits: 'set',
        type: 'action',
        className: 'm-r-md',
        level: 'primary',
        label: '测试权限-设置',
        tooltip: '仅用于权限测试，没有什么功能',
      },
      {
        limits: 'del',
        type: 'action',
        level: 'danger',
        className: 'm-r-md',
        label: '测试权限-删除',
        tooltip: '仅用于权限测试，没有什么功能',
      },
      {
        limits: 'invisible',
        type: 'action',
        label: '跳转侧边栏不可见页面',
        actionType: 'link',
        link: './invisible',
      },
    ],
  },
}
