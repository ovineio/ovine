/** 测试环境配置 */
import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  env: 'test',
  domain: {
    api: 'http://test-rtadmin.com/api',
  },
};
