const Chance = require('chance');
const _ = require('lodash');

const c = new Chance();

const sourceList = _.times(120, (index => ({
  _id: String(index + 200),
  title: c.word({ word: 6 }),
  click_url: c.url({
    path: 'qwe/er/123',
    domain: 'niasd',
  }),
  pic_url: 'http://pic2.qiyipic.com/image/20150313/76/b7/a_100010961_m_601_m1_180_236.jpg',
  order: c.integer({ max: 1000, min: 0 }),
  status: c.bool(),
  timestamp: c.date({ year: 2018 }),
  remark: c.sentence({ words: 4 }),
})));

module.exports = {
  idKey: '_id',
  key: 'poster',
  orderBy: [['status', 'order'], ['desc', 'asc']],
  source: sourceList,
};
