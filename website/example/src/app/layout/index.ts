import { routes } from '../routes'
import { itemUserSchema } from './item_user'

export const layout = {
  routes,
  type: 'aside-layout',
  header: {
    brand: {
      // 公司品牌
      logo: '/static/images/logo_line_white.png',
      title: 'Ovine',
      link: {
        title: 'dashboard',
        href: '/',
      },
    },
    items: [
      {
        type: 'item-dev-code',
      },
      {
        type: 'item-search-menu',
      },
      itemUserSchema,
      {
        type: 'item-setting',
        align: 'right',
      },
    ],
  },
}
