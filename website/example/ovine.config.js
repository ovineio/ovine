/**
 * Ovine 编译配置
 * 保存会自动重新执行 dev server. 请勿短时间内多次编辑并保存
 * 请按文档内容编辑好后再保存。或者关闭 dev server 进行编辑。
 * 文档： https://ovine.igroupes.com/org/docs/advance/configurations
 */

// const path = require('path')

module.exports = (option) => {
  const { env, port } = option

  const publicPathMap = {
    localhost: `http://localhost:${port}/demo/`,
    staging: 'https://ovine.igroupes.com/demo/',
    production: 'https://cdn-igroupes.com/ovine/',
  }

  const config = {
    publicPath: publicPathMap[env], // 静态资源公共路径
    favicon: '/static/images/favicon.ico',
    title: 'Ovine管理系统', // 页面标题
    envModes: ['localhost', 'staging', 'production'], // 环境列表
    ui: {
      defaultTheme: 'cxd',
    },
    devServer: {
      publicPath: '/demo/', // 路由访问相对于根目录的前缀
      openPage: '/demo/',
    },
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
        priority: 30,
      },
    },
  }

  return config
}
