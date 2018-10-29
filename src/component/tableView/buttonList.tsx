import * as React from 'react';
import { map, defaultsDeep } from 'lodash';
import { Menu, Dropdown, Icon, Row, Col } from 'antd';

import { getRouteMenuData } from '../../route/menu';
import check from '../authorized/checkPermissions';
import Wrapper, { WrapperProps } from '../wrapper';
import TableButton, { TableButtonProps } from './tableButton';
import { ButtonListConfigType, ActionListConfigType } from '.';

export interface ButtonListProps extends WrapperProps {
  className?: string;
  dropdown?: {
    text?: string | React.ReactNode;
    showIcon?: boolean;
  };
  children?: any;
  source?: any;
  buttonList: Array<TableButtonProps>;
}
const renderActions = (args: ButtonListProps) => {
  const { dropdown, buttonList, source } = args;
  const ActionWrapper = dropdown ? Menu : Row;
  const Item = dropdown ? Menu.Item : Col;

  return (
    <ActionWrapper
      className={dropdown ? 'button-list-dropdown' : 'button-list'}
    >
      {
        map(buttonList, (button: TableButtonProps, key: string) => {
          if (dropdown) {
            return (
              <Item key={key} >
                <TableButton buttonType="text" key={key} source={source} {...button} />
              </Item>
            );
          }
          return <TableButton key={key} source={source} {...button} />;
        })
      }
    </ActionWrapper>
  );
};

const ButtonList = (args: ButtonListProps): JSX.Element => {
  const { className, dropdown, children, ...restProps } = args;

  return (
    <Wrapper {...args}>
      <div className={className}>
        { !dropdown ? renderActions({ dropdown, ...restProps }) :
          <Dropdown
            overlay={renderActions({ dropdown, ...restProps })}
          >
            { children || (
              <a className="ant-dropdown-link" href="javascript:;">
                <span>{dropdown.text}</span>
                {dropdown.showIcon && <Icon type="down" />}
              </a>
            )}
          </Dropdown>}
      </div>
    </Wrapper>
  );
};

/**
 * 根据不同配置类型，获取对应按钮列表
 * @param list 按钮配置列表
 * @param actionList   定义所有的操作列表
 * @returns buttonList  获取所有定义好的列表
 */
export const getButtonList = (
  list: ButtonListConfigType,
  actionList: ActionListConfigType,
): Array<TableButtonProps> => {
  const btns: Array<TableButtonProps> = [];
  if ((list as ButtonListProps).buttonList) { // 类型断言
    return (list as ButtonListProps).buttonList;
  } else {
    (list as Array<string|TableButtonProps>).forEach(item => {
      if (typeof item === 'string') {
        btns.push(actionList[item]);
      } else {
        btns.push(defaultsDeep(item, actionList[item.actionkey]));
      }
    });
  }
  return btns;
};

/**
 * 所有列表按钮权限认证，当只有一个按钮时，数组只有一个参数
 * @param buttonList 需要验证的按钮列表参数
 * @returns authButtonList 权限认证成果的参数列表
 */
export const getAuthButtonList = (
  buttonList: Array<TableButtonProps>,
): false | Array<TableButtonProps> => {

  const { limit = {}, api = {}, path } = getRouteMenuData();

  const authButtonList: Array<TableButtonProps> = [];
  buttonList.forEach(btn => {
    const tempBtn = Object.assign({}, btn);
    const {
      actionkey,
      api: btnApi,
      requestOptions = {},
    } = tempBtn;

    if (!limit[actionkey]) {
      // eslint-disable-next-line
      console.error(`
        DEBUG ERROR: action配置actionKey必须要在routeConfig的limit字段中存在
        actionKey: ${actionkey}
      `);
      return;
    }

    if (btnApi && !api[btnApi]) {
      // eslint-disable-next-line
      console.error(`
        DEBUG ERROR: action配置api必须要在routeConfig的api字段中存在
        api: ${btnApi}
      `);
      return;
    }

    if (check(`${path}/${actionkey}`, true, false)) {
      if (btnApi) {
        tempBtn.requestOptions = {
          ...requestOptions,
          api: api[btnApi],
        };
      }
      authButtonList.push(tempBtn);
    }

  });

  if (!authButtonList.length) {
    return false;
  }

  return authButtonList;
};

export default ButtonList;
