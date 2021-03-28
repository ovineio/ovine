export const prdMenus = [
  {
    label: '实验功能',
    icon: 'fa fa-flask',
    nodePath: '/experiment',
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
          // {
          //   label: '数据视图', // 主要用于数据分析与挖掘
          //   nodePath: 'model_view',
          // },
          // {
          //   label: '自定义接口', // 提供第三方接口调用
          //   nodePath: 'mode_api',
          // },
          // {
          //   label: '数据面板', // 数据自定义展示： 表格数据，图表视图
          //   nodePath: 'model_dashboard',
          // },
        ],
      },
      // {
      //   label: '行程表',
      //   nodePath: 'calendar',
      // },
      // {
      //   label: '记录面板',
      //   nodePath: 'recorder',
      // },
    ],
  },
  // {
  //   label: '系统管理',
  //   icon: 'fa fa-cog',
  //   nodePath: 'system',
  //   children: [
  //     {
  //       label: '管理员用户',
  //       nodePath: 'user_list', // 对应 src/pages/system/user_list
  //     },
  //     {
  //       label: '管理员角色',
  //       nodePath: 'user_role', // 对应 src/pages/system/user_role
  //     },
  //   ],
  // },
]
