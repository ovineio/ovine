import list from '~/pages/admin_user/list'
import role from '~/pages/admin_user/role'

export const routesConfig = [
  {
    label: '',
    children: [
      {
        label: '系统管理',
        icon: 'glyphicon glyphicon-th',
        badgeClassName: 'bg-info',
        children: [
          {
            label: '管理员用户',
            path: 'pages/simple',
            component: list,
          },
          {
            label: '管理员权限',
            path: 'pages/error',
            component: role,
          },
        ],
      },
    ],
  },
]
