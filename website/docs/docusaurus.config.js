/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'RT-Admin',
  tagline: '基于JSON配置，快速搭建后台管理后台。',
  favicon: 'img/favicon.ico',
  organizationName: 'CareyToboo', // Usually your GitHub org/user name.
  projectName: 'rt-admin', // Usually your repo name.
  url: 'https://careytoboo.github.io/rt-admin',
  baseUrl: '/rtdocs/',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/shadesOfPurple'),
    },
    navbar: {
      title: 'RtAdmin',
      hideOnScroll: true,
      logo: {
        alt: 'SiteLogo',
        src: 'img/logo.png',
      },
      links: [
        { label: 'Docs', position: 'left', to: 'docs/overview' },
        { label: 'Demo', position: 'left', href: 'https://rt-admin.igroupes.com/' },
        {
          href: 'https://github.com/CareyToboo/rt-admin',
          label: 'GitHub',
          position: 'right',
        },
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
      // '@docusaurus/theme-live-codeblock',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        pages: {
          dev: ['dev'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
