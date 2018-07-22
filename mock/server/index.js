const utils = require('./utils');
const user = require('./api/user');
const adminList = require('./api/adminList');
const adminRole = require('./api/adminRole');
const poster = require('./api/poster');

global.mockData = {};

const { renderApi, renderCrudApi } = utils;
const apis = Object.assign(
  renderApi(user),
  renderCrudApi(adminList),
  renderCrudApi(adminRole),
  renderCrudApi(poster),
);

module.exports = apis;
