/**
 * Ovine 编译配置
 * 保存会自动重新执行 dev server. 请勿短时间内多次编辑并保存
 * 请按文档内容编辑好后再保存。或者关闭 dev server 进行编辑。
 * 文档： https://ovine.igroupes.com/org/docs/advance/configurations
 */

module.exports = {
  publicPath: '/demo/', // 必须以斜线结尾
  favicon: '/demo/static/images/favicon.ico',
  title: 'Ovine管理系统', // 页面标题
  envModes: ['localhost', 'staging', 'production'], // 环境列表
  initTheme: 'cxd',
}
