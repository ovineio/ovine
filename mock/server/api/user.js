const _ = require('lodash');
const limits = require('../../data/limit');
const { source: adminRoles } = require('../api/adminRole');
const { source: adminUsers } = require('../api/adminList');

const user = {};

const store = {
  session: { code: 0 },
};

user.logout = (req, res) => {
  store.session.code = 0;
  res.json({ code: 1 });
};

user.session = (req, res) => {
  res.json(store.session);
};

user['POST login'] = (req, res) => {
  store.session.code = 1;
  const userData = {
    code: 1,
    data: {
      name: 'admin',
      real_name: '斯嘉丽',
      ip: '192.168.31.252',
      _id: 100,
    },
  };

  const { name } = req.body;
  const adminUser = _.find(adminUsers, { name });
  const role = _.find(adminRoles, { _id: _.get(adminUser, 'role') });

  userData.data = Object.assign({}, userData.data, adminUser, limits, _.pick(role, ['menus', 'modules']));

  res.json(userData);
};

module.exports = user;
