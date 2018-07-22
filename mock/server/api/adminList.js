const Chance = require('chance');
const _ = require('lodash');
const roleData = require('../../data/role');

const c = new Chance();

const sourceList = _.times(10, (index) => {
  const id = `${index + 101}`;
  return {
    _id: id,
    name: `user${id}`,
    timestamp: c.date({ year: 2018 }),
    real_name: `用户${id}`,
    role: `${100 + _.random(1, roleData.length - 1)}`,
  };
});

sourceList.unshift({
  _id: '100',
  name: 'admin',
  timestamp: Date.now(),
  real_name: '超级用户',
  role: '100',
});

module.exports = {
  idKey: '_id',
  key: 'admin',
  source: sourceList,
};
