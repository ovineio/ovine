import * as React from 'react';
import classNames from 'classnames';
import { map } from 'lodash';
import { Button } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

import { exportTableToCsv, getTableCsvData } from '../../util/exportData';
import Wrapper from '../wrapper';
import ActionButton, { ActionButtonProps } from '../actionButton';

import { loadTableByType, resetFilter } from './utils';
import { TableLoadType } from './type';

import styles from './index.less';

type ToolItem = {
  icon: string,
  tip: string,
  click?: (...args: any[]) => any;
};

const tools: { [key: string]: ToolItem } = {
  restFilter: {
    icon: 'filter',
    tip: '重置检索框',
    click: resetFilter
  },
  refreshTable: {
    icon: 'reload',
    tip: '刷新表格',
    click: () => loadTableByType(TableLoadType.REFRESH),
  },
  exportCurrt: {
    icon: 'download',
    tip: '导出当前页',
    click: () => exportTableToCsv('test', getTableCsvData(
        document.querySelector('thead.ant-table-thead'),
        document.querySelector('tbody.ant-table-tbody')
    ))
  },
  // exportTotal: {
  //   icon: 'cloud-download',
  //   tip: '导出所有数据',
  // },
  help: {
    icon: 'info-circle-o',
    tip: '帮助信息',
  },
};

export default ({ className = '', ...restProps }) => {
  return (
    <Wrapper {...restProps} >
      <Button.Group
        className={classNames(`${className} tableview-toolbar`, styles.toolbar)}
      >
        {
          map(tools, (tool, key) => {
            // if (hideAction.filter(i => i === key).length) return;
            // if (toolbar[key] === false) return;
            const { icon, tip, click } = tool;
            const props: ActionButtonProps = {
              click,
              buttonProps: { icon },
              tooltip: {
                placement: 'top' as TooltipPlacement,
                title: tip,
              }
            };

            return <ActionButton key={key} {...props} />;
          })
        }
      </Button.Group>
    </Wrapper>
  );
};
