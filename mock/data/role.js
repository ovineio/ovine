const Chance = require('chance');

const c = new Chance();

module.exports = [{
  _id: '100',
  name: '超级管理员',
  timestamp: c.date({ year: 2018 }),
  remark: '拥有当前所有权限',
}, {
  _id: '101',
  name: '管理员一组',
  timestamp: c.date({ year: 2018 }),
  remark: '拥有一部分权限',
}, {
  _id: '102',
  name: '管理员二组',
  timestamp: c.date({ year: 2018 }),
  remark: '拥有一部分权限',
}, {
  _id: '103',
  name: '管理员三组',
  timestamp: c.date({ year: 2018 }),
  remark: '拥有一部分权限',
}];
