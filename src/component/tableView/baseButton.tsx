import * as React from 'react';
import ActionButton, { ActionButtonProps, BaseActionButtonProps, ButtonClickArgs } from '../actionButton';
import { BaseButtonClickArgs } from './index';
import * as tableUtils from './utils';

export interface BaseButtonClickProps extends BaseActionButtonProps {
  beforeClick?: (args: BaseButtonClickArgs) => any | void;
  click?: (args: BaseButtonClickArgs) => any | void;
  afterClick?: (args: BaseButtonClickArgs) => void;
}

export default (props: BaseButtonClickProps): JSX.Element => {
  const { beforeClick, click, afterClick } = props;
  const actions: BaseButtonClickArgs = tableUtils;

  let defProps: ActionButtonProps = {};

  if (typeof beforeClick === 'function') {
    defProps.beforeClick = async (args?: ButtonClickArgs) => {
      const clickArgs: BaseButtonClickArgs = { ...args, ...actions };
      return await beforeClick(clickArgs);
    };
  }

  if (typeof click === 'function') {
    defProps.click = async (args?: ButtonClickArgs) => {
      const clickArgs: BaseButtonClickArgs = { ...args, ...actions };
      return await click(clickArgs);
    };
  }

  if (typeof afterClick === 'function') {
    defProps.afterClick = async (args?: ButtonClickArgs) => {
      const clickArgs: BaseButtonClickArgs = { ...args, ...actions };
      return await afterClick(clickArgs);
    };
  }

  defProps = Object.assign({}, props, defProps);

  return <ActionButton  {...defProps} />;
};
