import common from './default';
import { Config } from 'config';

export default <Config> {
  ...common,
  env: 'develop',
  domain: {
    api: 'http://dev-rtadmin.com/api',
  },
};
