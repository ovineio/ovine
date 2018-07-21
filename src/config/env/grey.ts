/** 灰度环境配置 */
import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  env: 'grey',
  domain: {
    api: 'http://grey-rtadmin.com/api',
  },
};
