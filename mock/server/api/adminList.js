const Chance = require('chance');
const utils = require('../utils');

const c = new Chance();

const sourceList = utils.times(120, (index) => ({
  _id: String(index + 1),
  name: c.word({ word: 6 }),
  timestamp: c.date({ year: 2018 }),
  nick_name: c.sentence({ words: 2 }),
  role: String(index + 200),
}));

module.exports = utils.renderCrudApi({
  idKey: '_id',
  key: 'admin',
  source: sourceList,
});
