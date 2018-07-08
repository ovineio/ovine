import * as React from 'react';
import { TableButtonProps } from './tableButton';
import ButtonList, { getButtonList, getAuthButtonList } from './buttonList';
import { ActionListConfigType, ButtonListConfigType } from './index';

export default (args: {
  handler: ButtonListConfigType,
  actionList: ActionListConfigType,
}): JSX.Element | null => {

  const { handler, actionList } = args;
  const authedActions: false | Array<TableButtonProps>
    = getAuthButtonList(getButtonList(handler, actionList));

  if (!authedActions) {
    return null;
  }

  return (
    <ButtonList
      buttonList={authedActions}
    />
  );
};
