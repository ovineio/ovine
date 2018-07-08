const Chance = require('chance');
const utils = require('../utils');
const limits = require('../../data/limit');

const c = new Chance();

const sourceList = utils.times(120, (index) => (Object.assign({}, limits, {
  _id: String(index + 200),
  name: c.word({ word: 6 }),
  timestamp: c.date({ year: 2018 }),
  remark: c.sentence({ words: 4 }),
})));

module.exports = utils.renderCrudApi({
  idKey: '_id',
  key: 'role',
  source: sourceList,
});
