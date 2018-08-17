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
  pic_url: 'https://avatars0.githubusercontent.com/u/15522313?s=460&v=4',
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
