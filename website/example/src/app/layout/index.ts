import routes from '../routes/index'
import { itemUserSchema } from './item_user'

export const layout = {
  routes,
  type: 'aside-layout',
  header: {
    brand: {
      // 公司品牌
      logo: '/demo/static/images/logo_line_white.png',
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
        type: 'head-item',
        faIcon: 'question-circle',
        tip: '查看文档',
        href: 'https://ovine.igroupes.com/org/',
      },
      {
        type: 'item-search-menu',
      },
      {
        type: 'head-item',
        align: 'right',
        body: {
          type: 'html',
          html: `
          <a
            target="blank"
            href="https://github.com/CareyToboo/ovine"
            data-tooltip="Github 源码"
            data-position="bottom"
          >
            <img
              alt="github starts"
              src="https://img.shields.io/github/stars/CareyToboo/ovine?style=social"
            />
          </a>
        `,
        },
      },
      itemUserSchema,
      {
        type: 'item-setting',
        align: 'right',
      },
    ],
  },
}
