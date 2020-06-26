/**
 * 项目内路由，每次新增或者修改页面需要在这里添加路由信息
 * 详细文档：https://ovine.igroupes.com/org/docs/advance/configurations#%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE
 *
 * 会根据 nodePath 字段，自动匹配 pages 文件夹下的 xxx/index  文件。
 * 由于使用了 文件动态引入，每次新增加页面时，dev server 可能会报 找不到文件错误，重启下 dev server 就好。
 */

import { LimitMenuItem } from '@core/routes/types'

export const menuRoutes: LimitMenuItem = {
  nodePath: '/',
  limitLabel: '侧边栏目录',
  label: '',
  children: [
    {
      path: '/',
      label: 'Dashboard',
      nodePath: 'dashboard',
      exact: true,
      pathToComponent: 'dashboard',
      sideVisible: false, // 不会显示在侧边栏
    },
    {
      label: '页面编辑',
      icon: 'fa fa-coffee',
      nodePath: 'start',
    },
    {
      label: 'DEMO应用',
      icon: 'fa fa-paint-brush',
      nodePath: 'application',
      children: [
        {
          label: '热更新管理',
          nodePath: 'hot', // 对应 src/pages/application/hot
        },
        {
          label: '文档管理',
          nodePath: 'doc', // 对应 src/pages/application/doc
        },
      ],
    },
    {
      label: '系统管理',
      icon: 'fa fa-wrench',
      nodePath: 'system',
      children: [
        {
          label: '管理员用户',
          nodePath: 'user_list', // 对应 src/pages/system/user_list
        },
        {
          label: '管理员角色',
          nodePath: 'user_role', // 对应 src/pages/system/user_role
        },
        {
          label: '系统操作日志',
          nodePath: 'user_log', // 对应 src/pages/system/user_log
        },
      ],
    },
  ],
}
