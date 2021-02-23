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
      label: '仪表盘',
      nodePath: 'dashboard',
      exact: true,
      pathToComponent: 'dashboard',
      sideVisible: false, // 不会显示在侧边栏
    },
    {
      label: '在线编辑页面',
      icon: 'fa fa-pencil',
      nodePath: 'test_editor',
    },
    {
      label: 'JSON编辑页面',
      icon: 'fa fa-coffee',
      nodePath: 'start',
    },
    {
      label: '实验功能',
      icon: 'fa fa-flask',
      nodePath: 'experiment',
      badgeClassName: 'bg-danger',
      badge: 2,
      children: [
        {
          label: '数据中心',
          nodePath: 'data_model',
          children: [
            {
              label: '数据模型',
              nodePath: 'mode_list',
            },
            {
              label: '数据视图', // 主要用于数据分析与挖掘
              nodePath: 'model_view',
            },
            {
              label: '自定义接口', // 提供第三方接口调用
              nodePath: 'mode_api',
            },
            {
              label: '数据面板', // 数据自定义展示： 表格数据，图表视图
              nodePath: 'model_dashboard',
            },
          ],
        },
        {
          label: '记录面板',
          nodePath: 'recorder',
        },
      ],
    },
    {
      label: '系统管理',
      icon: 'fa fa-cog',
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
    {
      label: '用于测试',
      icon: 'fa fa-dribbble',
      nodePath: 'application',
      children: [
        {
          label: '远程页面',
          nodePath: 'remote_schema',
          pathToComponent: 'root://demo/static/js/test_remote_schema.js',
        },
        {
          label: '热更新管理',
          nodePath: 'hot', // 对应 src/pages/application/hot
        },
        {
          label: '文档管理',
          nodePath: 'doc', // 对应 src/pages/application/doc
        },
        {
          label: '父级页面',
          nodePath: 'parent',
          exact: true,
          children: [
            {
              label: '子级页面',
              nodePath: 'child',
            },
            {
              label: '子级不可见',
              nodePath: 'invisible',
              sideVisible: false, // 不会显示在侧边栏
            },
          ],
        },

        {
          label: '测试渲染器',
          nodePath: 'cases',
          children: [
            {
              label: '音频播放',
              nodePath: 'audio',
            },
            {
              label: '视频播放',
              nodePath: 'video',
            },
            {
              label: '自定义',
              nodePath: 'custom',
            },
          ],
        },
      ],
    },
  ],
}
