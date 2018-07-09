const limits = require('../../data/limit');

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

user.login = (req, res) => {
  store.session.code = 1;
  const userData = {
    code: 1,
    data: {
      name: 'scarlett',
      nick_name: '斯嘉丽',
      ip: '192.168.31.252',
      _id: 12807,
    },
  };

  userData.data = Object.assign({}, userData.data, limits);

  res.json(userData);
};

module.exports = user;
