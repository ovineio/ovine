/**
 * for demo deploy
 */

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./server');

const app = express();

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (typeof value === 'function') {
      value(...args);
    } else {
      res.json(value);
    }
  };
}

function realApplyMock() {
  app.use(bodyParser.json({ limit: '5mb', strict: false }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb',
  }));

  Object.keys(config).forEach(key => {
    const keyParsed = parseKey(key);
    assert(!!app[keyParsed.method], `method of ${key} is not valid`);
    assert(
      typeof config[key] === 'function' ||
        typeof config[key] === 'object',
      `mock value of ${key} should be function or object, but got ${typeof config[
        key
      ]}`
    );

    app[keyParsed.method](
      keyParsed.path,
      createMockHandler(keyParsed.method, keyParsed.path, config[key])
    );
  });
}

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const [newmethod, newpath] = key.split(' ');
    method = newmethod.toLowerCase();
    path = newpath;
  }

  return { method, path };
}

realApplyMock();

app.listen(8021, () => {
  console.info('mock sever on: 8021');
});

