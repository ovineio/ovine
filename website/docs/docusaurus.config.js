// TODO: 优化文档UI

module.exports = {
  title: 'RT-ADMIN',
  tagline: '用JSON构建管理系统',
  favicon: 'img/favicon.ico',
  organizationName: 'CareyToboo', // Usually your GitHub org/user name.
  projectName: 'rt-admin', // Usually your repo name.
  url: 'https://careytoboo.github.io/rt-admin',
  baseUrl: '/rtdocs/',
  scripts: ['https://buttons.github.io/buttons.js'],
  themeConfig: {
    algolia: {
      apiKey: 'e641d82b10af84aa818e883b1035c3b4',
      indexName: 'craft-js',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    prism: {
      // eslint-disable-next-line
      theme: require('prism-react-renderer/themes/shadesOfPurple'),
    },
    navbar: {
      title: 'RT-ADMIN',
      // hideOnScroll: true,
      logo: {
        alt: 'SiteLogo',
        src: 'img/logo.png',
      },
      links: [
        { label: '文档', position: 'left', to: 'docs/intro/overview' },
        { label: '演示项目', position: 'left', href: 'https://rt-admin.igroupes.com/' },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} CareyToboo RtAdmin.`,
    },
  },
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
}
