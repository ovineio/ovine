/**
 * text component
 */
import React from 'react';
import AntEllipsis from '../ellipsis';

const TextField = ({
  value,
  isLink = false,
  tooltip = true,
  length,
  lines,
  ...restProps
}) => {
  let text = value;
  if (length) {
    text = <AntEllipsis title={value} text={value} length={length} tooltip={tooltip} />;
  }

  if (isLink) {
    return (
      <a {...restProps} title="val"> { text } </a>
    );
  }

  return (
    <span {...restProps}>
      { text }
    </span>
  );
};

export const Link = props => TextField({
  isLink: true,
  ...props,
});

export const Ellipsis = props => TextField({
  ...props,
});

export default TextField;
