
const _ = require('lodash');

const prefix = 'mock';

const utils = { };

const methods = {
  add: 'PUT',
  edit: 'POST',
  del: 'DELETE',
  list: 'GET',
};

utils.crud = ({ idKey, apiType, source, req, res, orderBy }) => {
  let input = source || [];
  if (!_.isArray(input)) {
    input = [input];
  }

  let data = input;
  let result = {};
  let { body = {}, query = {} } = req;

  if (_.isString(body)) {
    body = JSON.parse(body);
  }

  const { page, size } = query;
  const restQueryKey = _.omit(query, ['page', 'size']);

  const index = _.findIndex(input, { [idKey]: String(_.get(body, idKey)) });

  const commonKeys = {
    timestamp: Date.now(),
  };

  switch (apiType) {
    case 'add':
      body[idKey] = _.uniqueId();
      body = Object.assign({}, commonKeys, body);
      input.push(body);
      data = body;
      break;

    case 'edit':
      data = _.assign({}, commonKeys, input[index], body);
      _.set(input, index, data);
      break;

    case 'del':
      _.pullAt(input, index);
      data = { [idKey]: _.get(body, idKey) };
      break;

    case 'list':
      if (_.keys(restQueryKey).length) { // 剔除不存在 数据中的 查询条件
        query = _.keys(restQueryKey).filter(queryKey => _.includes(_.keys(input[0]), queryKey));
      }
      data = input.filter(i => _.isMatch(i, _.pick(req.query, query)));
      break;

    default:
      data = _.filter(input, req.query = {});
  }

  if (orderBy) {
    data = _.orderBy(data, orderBy[0], orderBy[1]);
  }

  result = { data };

  if (apiType === 'list' && page && size) {
    result = utils.getPaginationData({ source: data, page, size });
  }

  return res.json(Object.assign(
    { code: 1 },
    result,
  ));
};

utils.renderCrudApi = ({
  idKey = 'id', key, source, omitKeys = [], isRestful = false, orderBy,
}) => {
  const result = {};

  const apiTpess = _.omit(methods, omitKeys);
  _.map(apiTpess, (method, apiType) => {
    const apiPath = `/${apiType}`;
    const baseMethod = !isRestful && apiType === 'list' ? 'GET' : 'POST';
    const pathKey = `${isRestful ? method : baseMethod} /${prefix}/${key}${isRestful ? '' : apiPath}`;
    result[pathKey] = (req, res) => utils.crud({
      idKey, apiType, req, res, isRestful, source, orderBy });
  });

  return result;
};

utils.renderApi = (apis) => {
  const result = {};

  _.map(apis, (val, url) => {
    const method = _.trim(_.get(_.trim(url).match(/^.* /), 0)) || 'GET';
    const api = url.replace(/^.* /, '');
    result[`${method} /${prefix}/${api}`] = val;
  });

  return result;
};

utils.getPaginationData = ({ page, size, source }) => {
  if (!_.isArray(source)) {
    return {
      data: [source],
      count: 1,
      page: 1,
      pageSize: size,
    };
  }

  const index = Number(page);
  const pageSize = Number(size);
  const count = source.length;
  const startIndex = (index - 1) * pageSize;
  const data = source.slice(startIndex, startIndex + pageSize);

  return {
    page: index,
    count,
    data,
    pageSize,
  };
};

module.exports = utils;

