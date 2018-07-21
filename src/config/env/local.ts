/** 本地环境配置 */
import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  isMock: true,
  env: 'local',
  domain: {
    api: 'http://local-rtadmin.com/api',
  },
};
