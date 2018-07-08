import React, { createElement } from 'react';
import { Alert } from 'antd';
import { snakeCase, includes, isUndefined } from 'lodash';
import { HEADER_NONE } from '../../constant/misc';
import { formatStringByType } from '../../util/misc';

const stringTypes = [
  'Number.Int',
  'Number.Float',
  'Number.Dvide',
  'Number.Percent',
  'Date',
  'Date.Date',
  'Date.Month',
  'Date.Time',
];

const componetTypes = [
  'Text',
  'Text.Link',
  'Text..Ellipsis',
  'Status',
  'Status.YesNo',
  'Image',
];

export const getDisplayItem = (type, props = {}) => {
  const { defalutValue, value, ...restProps } = props;
  const val = !isUndefined(value) ? value :
    !isUndefined(defalutValue) ? defalutValue :
      !isUndefined(HEADER_NONE[type]) ?
        HEADER_NONE[type] : '--';

  if (isUndefined(value) && isUndefined(defalutValue)) {
    return '--';
  }

  if (includes(stringTypes, type)) {
    return formatStringByType(type, value, restProps);
  }

  if (!includes(componetTypes, type)) {
    return val;
  }

  restProps.value = value || defalutValue;

  let Component = null;
  try {
    const types = type.indexOf('.') > -1 ? type.split('.') : [type, 'default'];
    types[0] = snakeCase(types[0]);
    // eslint-disable-next-line
    Component = createElement(require(`./${types[0]}`)[types[1]], restProps);
  } catch (e) {
    Component = <Alert message="ColumnItem type error" />;
  }
  return Component;
};
