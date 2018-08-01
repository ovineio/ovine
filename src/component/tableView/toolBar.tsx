import * as React from 'react';
import classNames from 'classnames';
import { map } from 'lodash';
import { Button } from 'antd';

import ActionButton from '../actionButton';
import Wrapper from '../wrapper';
import styles from './index.less';

const tools = {
  rest: {
    icon: 'filter',
    tip: '重置检索框',
  },
  refresh: {
    icon: 'reload',
    tip: '刷新表格',
  },
  exportCurrt: {
    icon: 'download',
    tip: '导出当前页',
  },
  exportTotal: {
    icon: 'cloud-download',
    tip: '全量导出',
  },
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
            const { icon, tip } = tool;

            return (
              <ActionButton
                key={key}
                tooltip={{
                  placement: 'top',
                  title: tip,
                }}
                buttonProps={{ icon }}
              />
            );
          })
        }
      </Button.Group>
    </Wrapper>
  );
};
