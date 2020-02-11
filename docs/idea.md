- 思考如何 不写任何 接入 admin，直接使用 pages 文件下 开始编写代码
  - webpack 文件懒加载问题、打包问题
  - 项目初始化问题

```
- pages/xxx/
  - hot_config 预设文件
    - index.tsx
    - preset.ts
    - mock.ts

// 入口配置
const config = {
  type: 'rt-app',
  routes: {
    public: [{
      path: '/login',
    }, {
      path: '/404',
    }],
    private: [{
      path: '/dashboard',
    }]
  },
  env: {

  },
  amis: {

  },
  // 支持自定义
  layout: {
    type: 'aside-menu',
    header: {
    toolbar: [{
        'icon-fold',
        {
          type: 'user-info',
          align: 'right'
        },
        {
          type: 'side-menu-search',
          align: 'right'
        },
        {
          type: 'app-setting',
          align: 'right'
        },
        {
          type: 'icon-question',
          align: 'right'
        }
      }]
    },
    footer: {

    }
  },
}

initRtAdmin(config)
```
