const utils = require('./utils');
const user = require('./api/user');
const adminList = require('./api/adminList');
const adminRole = require('./api/adminRole');
const poster = require('./api/poster');

global.mockData = {};

const apis = Object.assign(
  utils.renderApi(user),
  adminList,
  adminRole,
  poster
);

module.exports = apis;
