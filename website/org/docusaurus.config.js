// TODO: 优化文档UI

module.exports = {
  title: 'Ovine',
  tagline: '用JSON构建管理系统',
  favicon: 'img/favicon.ico',
  organizationName: 'CareyToboo', // Usually your GitHub org/user name.
  projectName: 'ovine', // Usually your repo name.
  url: 'https://careytoboo.github.io/ovine',
  baseUrl: '/org/',
  onBrokenLinks: 'ignore',
  themeConfig: {
    hideableSidebar: true,
    algolia: {
      apiKey: 'b29013cc1a8ece1096c76faf3ed1e297',
      indexName: 'igroupes_ovine',
      // contextualSearch: true,
    },
    prism: {
      // eslint-disable-next-line
      theme: require('prism-react-renderer/themes/shadesOfPurple'),
    },
    navbar: {
      title: 'Ovine',
      // hideOnScroll: true,
      logo: {
        alt: 'SiteLogo',
        src: 'img/logo.png',
      },
      items: [
        { label: '文档', position: 'left', to: 'docs/intro/overview' },
        {
          label: '创建应用',
          position: 'left',
          to: 'http://ovine.igroupes.com/apps/factory/',
        },
        { label: '更新日志', position: 'left', href: '/org/blog/changelog/', target: '_self' },
        {
          label: '案例项目',
          to: '/org/showcase',
        },
        {
          href: 'https://github.com/CareyToboo/ovine',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} CareyToboo Ovine.`,
    },
  },
  themes: ['@docusaurus/plugin-ideal-image'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  scripts: [
    '/org/scripts/bdstat.js',
    '/org/scripts/jquery.min.js',
    '/org/scripts/jquery.localscroll.js',
  ],
}
