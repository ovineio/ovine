/**
 * Amis路由
 */

import { RouteItem } from '../route'

const amisRoute: RouteItem = {
  label: 'Amis 示例',
  children: [
    {
      label: '热配置管理',
      icon: 'glyphicon glyphicon-th',
      path: 'hot_config',
    },
  ],
}

export default amisRoute
