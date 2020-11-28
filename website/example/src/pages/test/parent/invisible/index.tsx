export const schema = {
  type: 'page',
  title: '用于测试侧边栏不可见页面',
  body: {
    type: 'wrapper',
    body: [
      {
        type: 'alert',
        body: '虽然侧边栏不看见，但还是需要设置权限才能访问。',
      },
      {
        type: 'alert',
        body: '侧边栏不看见，默认高亮最近的父tab。',
      },
    ],
  },
}
