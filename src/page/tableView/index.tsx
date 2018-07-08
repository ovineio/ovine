import * as React from 'react';
import classNames from 'classnames';
import { Location } from 'history';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import TableView, { TableConfig } from '../../component/tableView';
import renderHandler from '../../component/tableView/handler';
import { linkTo } from '../../component/tableView/utils';
import { flatedMenuData, FlatedMenuConfig } from '../../route/menu';
import styles from '../../component/tableView/index.less';

import renderExceptionPage from '../exception';

export interface TablePageProps {
  location: Location;
}

export default class TablePage extends React.PureComponent<TablePageProps, {}> {
  static childContextTypes = {
    config: PropTypes.object,
  };

  static defaultProps = {
    location: {},
  };

  static propTypes = {
    location: PropTypes.object,
  };

  private config: TableConfig | null = null;
  private routeConfig: FlatedMenuConfig = flatedMenuData[location.pathname];

  getChildContext() {
    return {
      config: this.config,
    };
  }

  componentWillMount() {
    this.setConfig(this.props.location.pathname);
  }

  componentWillReceiveProps(nextprops: TablePageProps) {
    if (nextprops.location.pathname !== this.props.location.pathname) {
      this.setConfig(nextprops.location.pathname);
    }
  }

  setConfig = (path: string): void => {
    const confpath = `${path.substr(1, path.length - 1)}`;

    if (!path || !confpath) {
      return;
    }

    try {
      this.routeConfig = flatedMenuData[path];
      this.config = require(`../${confpath}.ts`).default;
    } catch (e) {
      this.config = null;
    }
  }

  renderTabs = () => {
    const tables: Array<React.ReactNode> = [];
    const { tabs = [], path: currPath } = this.routeConfig;
    if (!tabs.length) {
      tabs.push(currPath);
    }
    tabs.forEach((tabPath: any = {}) => {
      const { isHideInMenu = false, isTableView = true, path, name } = flatedMenuData[tabPath];
      if (isHideInMenu || !isTableView) {
        return;
      }
      tables.push(
        <Tabs.TabPane key={path} tab={name} >
          <TableView />
        </Tabs.TabPane >
      );
    });
    return tables;
  }

  render() {
    if (!this.config) {
      return renderExceptionPage('404');
    }

    const { path } = this.routeConfig;
    const { handler, actionList } = this.config;

    return (
      <div className={classNames(`tableview`, styles.tableview)}>
        <Tabs
          animated={false}
          defaultActiveKey={path}
          onTabClick={(tabkey: string) => linkTo(tabkey)}
          tabBarExtraContent={handler && renderHandler({ handler, actionList })}
        >
          {this.renderTabs()}
        </Tabs>
      </div>
    );
  }
}
