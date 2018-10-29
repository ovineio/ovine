
import * as React from 'react';
import { HEADER_WIDTH } from '../../constant/misc';
import { TableButtonProps } from './tableButton';
import ButtonList, { getButtonList, getAuthButtonList } from './buttonList';
import { ColumnConfig, ActionListConfigType, TableConfig } from './index';

const getHandlerItem = (
  item: ColumnConfig<any>,
  actionList: ActionListConfigType,
): ColumnConfig<any> | undefined => {

  item = {
    ...item,
    width: 80,
    title: <span className="no-export-cell">操作</span>,
    sorter: false,
  };

  const { list, title } = item;

  if (!list) {
    console.error('column.handler必须传list参数');
    return;
  }

  const authedActions: false | Array<TableButtonProps>
    = getAuthButtonList(getButtonList(list, actionList));

  if (!authedActions) {
    return;
  }

  item.render = (...args: any[]): React.ReactNode => {
    const dropdown = {
      text: title,
      showIcon: true,
    };
    return (
      <ButtonList
        className="no-export-cell"
        dropdown={dropdown}
        source={args[1]._source}
        buttonList={authedActions}
      />
    );
  };

  return item;
};

export default (args: Pick<TableConfig, 'column' | 'actionList' >): ColumnConfig<any>[] => {
  const { column, actionList } = args;
  const colmuns: ColumnConfig<any>[] = [];

  Object.keys(column).forEach((k: string) => {
    const {
      dataIndex,
      width,
      render,
      componentType = '',
    } = column[k];

    // 有render参数不做任何处理
    if (render) {
      return colmuns.push(column[k]);
    }

    let item: ColumnConfig<any> = {
      width: width || HEADER_WIDTH[componentType] || 100,
      dataIndex: dataIndex || k,
      sorter: true,
      ...column[k],
    };

    let colmunItem: any = item;

    if (k === 'handler') { // 存在 hanlder 才显示
      colmunItem = getHandlerItem(item, actionList);
    }

    if (colmunItem) {
      colmuns.push(colmunItem);
    }
  });
  return colmuns;
};
