/** 本地环境配置 */
import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  isMock: true, // mock server
  env: 'local',
  domain: {
    // local api server
    api: 'http://localhost:8020/api',
  },
};
