import React, { createElement } from 'react';
import { Alert } from 'antd';
import { snakeCase } from 'lodash';

// const AntTypes = [
//   'TimePicker',
//   'DatePicker',
//   'MonthPicker',
//   'WeekPicker',
// ];

export default (type, props) => {
  if (!type) return;

  let Component = null;
  try {
    const types = type.indexOf('.') > -1 ?
      type.split('.') : [type, 'default'];
    types[0] = snakeCase(types[0]);
    // eslint-disable-next-line
    Component = createElement(require(`./${types[0]}`)[types[1]], props);
  } catch (e) {
    Component = <Alert message="InputItem type error" />;
  }
  return Component;
};

