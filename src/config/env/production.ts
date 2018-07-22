/** 生产环境配置 */
import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  env: 'production',
  domain: {
    api: 'http://rtadmin.com/api',
  },
};
