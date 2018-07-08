const IS_MOCK = typeof IS_MOCK === 'undefined';
const ENV = typeof ENV === 'undefined' ? 'local' : ENV;
// 公共配置
module.exports = {
  env: ENV,
  isMock: IS_MOCK,
  appTitle: 'RT—ADMIN',
  description: '等风来不如追风去，追逐的过程就是人生的意义',
};
