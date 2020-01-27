import user_list from '~/pages/system/user_list'
import user_log from '~/pages/system/user_log'
import user_role from '~/pages/system/user_role'

export const routesConfig = [
  {
    label: 'RT-ADMIN 实际应用',
    children: [
      {
        label: '热配置管理',
        icon: 'glyphicon glyphicon-th',
        badgeClassName: 'bg-info',
        path: 'hot_config',
        component: user_role,
      },
      {
        label: '博客管理',
        icon: 'glyphicon glyphicon-th',
        badgeClassName: 'bg-info',
        children: [
          {
            label: '文章管理',
            path: 'blog/article',
            component: user_list,
          },
          {
            label: '评论管理',
            path: 'blog/comment',
            component: user_role,
          },
        ],
      },
      {
        label: '系统管理',
        icon: 'glyphicon glyphicon-th',
        badgeClassName: 'bg-info',
        children: [
          {
            label: '管理员用户',
            path: 'system/user_list',
            component: user_list,
          },
          {
            label: '管理员权限',
            path: 'system/user_role',
            component: user_role,
          },
          {
            label: '系统操作日志',
            path: 'system/user_log',
            component: user_log,
          },
        ],
      },
    ],
  },
  {
    label: 'Amis 示例',
    children: [
      {
        label: '热配置管理',
        icon: 'glyphicon glyphicon-th',
        badgeClassName: 'bg-info',
        path: 'hot_config',
        component: user_role,
      },
    ],
  },
]
