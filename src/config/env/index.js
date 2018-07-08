const base = require('./default');

// eslint-disable-next-line
const env = require(`./${base.env}`);
const config = Object.assign(base, env);

export default config;
