/**
 * 布局配置
 */

import { getStore, setStore } from '@core/utils/store'
import { getUrlParams } from '@core/utils/tool'

import { storeKeys } from '../constants'
import routes from '../routes/index'
import { SocketDialogManger } from './dialog'
import { itemUserSchema } from './item_user'

/**
 * 目前布局这块没有权限控制逻辑
 */
export const layout = {
  routes,
  type: 'aside-layout', // 侧边栏布局
  // debounceRoute: 100,
  routeTabs: {
    enable: true,
    storage: true,
    maxCount: 12,
  },
  header: {
    brand: {
      // 公司品牌
      logo: '/demo/static/images/logo_line_white.png',
      title: 'Ovine 演示后台系统',
      link: {
        title: 'dashboard',
        href: '/',
      },
    },
    // 头部 工具项
    items: [
      {
        type: 'item-dev-code', // 查看页面JSON， release 环境不会显示。
      },
      {
        type: 'container',
        className: 'd-none', // 设置为不显示状态
        body: {
          component: SocketDialogManger,
        },
      },
      {
        type: 'head-item',
        faIcon: 'question-circle',
        tip: '查看文档',
        href: 'https://ovine.igroupes.com/org/',
      },
      {
        type: 'head-item',
        faIcon: 'edit',
        tip: '体验编辑器',
        href: '/demo/editor',
      },
      {
        type: 'button',
        icon: 'fa fa-bug',
        iconOnly: true,
        level: 'link',
        tooltip: '修改调试信息',
        className: getUrlParams('debug') || getStore(storeKeys.debugProps) ? '' : 'd-none', // 设置为不显示状态
        actionType: 'dialog',
        dialog: {
          title: '设置调试信息',
          body: {
            type: 'form',
            mode: 'normal',
            onSubmit: (value) => {
              const { env } = value
              setStore(storeKeys.debugProps, typeof env === 'string' ? JSON.parse(env) : env)
              window.location.reload()
            },
            controls: [
              {
                name: 'env',
                label: '环境变量',
                value: getStore(storeKeys.debugProps) || {},
                type: 'json-editor',
                validations: {
                  isJson: true,
                },
                validationErrors: {
                  isJson: '请输入正确的JSON格式数据',
                },
              },
            ],
          },
        },
      },
      {
        type: 'item-search-menu', // 搜索侧边栏
      },
      {
        type: 'head-item', // 头部工具项
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
      itemUserSchema, // 用户头像展示扩展
      {
        type: 'item-setting', // 系统设置
        align: 'right',
      },
    ],
  },
}
