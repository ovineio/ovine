/**
 * Ovine 编译配置
 * 保存会自动重新执行 dev server. 请勿短时间内多次编辑并保存
 * 请按文档内容编辑好后再保存。或者关闭 dev server 进行编辑。
 * 文档： https://ovine.igroupes.com/org/docs/advance/configurations
 */

// const path = require('path')

module.exports = (option) => {
  const { env } = option

  const publicPathMap = {
    localhost: '/demo/',
    staging: 'https://ovine.igroupes.com/demo/',
    production: 'https://cdn-igroupes.com/ovine/',
  }

  const config = {
    appKey: 'ovineDemo',
    publicPath: publicPathMap[env], // 静态资源公共路径
    dll: {
      // useJsdelivr: true,
      // hostDir: 'https://ovine.igroupes.com/demo/static/ovine/dll/[dllVer]/',
    },
    favicon: '/static/images/favicon.ico',
    title: 'Ovine管理系统', // 页面标题
    envModes: ['localhost', 'staging', 'production'], // 环境列表
    staticFileExts: ['cur'],
    // ui: {
    //   defaultTheme: 'antd',
    //   // appTheme: 'dark',
    // },
    devServer: {
      publicPath: '/demo/', // 路由访问相对于根目录的前缀
      openPage: '/demo/',
    },
    splitRoutes: [
      {
        test: /experiment[\\/]data_model/,
        name: 'data_model',
      },
    ],
    cacheGroups: {
      amisEditor: {
        chunks: 'async',
        name: 'amis_editor',
        test: /[\\/]node_modules[\\/]@ovine[\\/]editor[\\/]/,
        priority: 40,
      },
      ovineCraft: {
        chunks: 'async',
        name: 'ovine_craft',
        test: /[\\/]node_modules[\\/]@ovine[\\/]craft[\\/]/,
        priority: 40,
      },
      tuiCalendar: {
        chunks: 'async',
        name: 'tui_calendar',
        test: /[\\/]node_modules[\\/]tui-calendar/,
        priority: 40,
      },
      butterflyDag: {
        chunks: 'async',
        name: 'butterfly_dag',
        test: /[\\/]node_modules[\\/]butterfly-dag/,
        priority: 40,
      },
    },
  }

  return config
}
