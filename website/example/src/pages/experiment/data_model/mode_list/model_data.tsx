import * as tpl from './template'

export const modelDataSchema = {
  type: 'hbox',
  columns: [
    {
      columnClassName: 'model-list-nav',
      type: 'lib-renderer',
      renderer: 'sysScrollBar',
      body: {
        type: 'nav',
        stacked: true,
        links: [
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
          {
            label: 'Nav 1',
            to: '/docs/index',
            active: true,
          },
          {
            label: 'Nav 2',
            to: '/docs/api',
          },
          {
            label: 'Nav 3',
            to: '/docs/renderers',
          },
        ],
      },
    },

    tpl.getModelDataTable(),
  ],
}
