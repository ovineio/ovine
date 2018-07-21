/**
 * status tag component
 */

import React from 'react';
import { get } from 'lodash';
// import { Input } from 'antd';
// status: {
//   0: {
//     color: '#ff3333',
//     text: '是',
//   },
//   1: {
//     color: '#278300',
//     text: '否',
//   },
// },

const Status = ({
  value,
  defaultValue,
  filter = val => Number(!!val),
  status,
  ...restProps
}) => {
  const action = restProps.filter || filter;
  const color = status ? get(status, `[${action(value) || 0}].color`) :
    get(restProps, `color[${action(value) || 0}]`);

  const text = status ? get(status, `[${action(value) || 0}].text`) :
    get(restProps, `text[${action(value) || 0}]`);

  const style = {
    ...restProps.style,
    color,
  };

  return (
    <span {...restProps} style={style}>
      { text }
    </span>
  );
};

export const YesNo = props => Status({
  color: ['#ff3333', '#278300'],
  text: ['是', '否'],
  ...props,
});

export default Status;
