import * as React from 'react';
import classNames from 'classnames';
import { Location, History } from 'history';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import { flatedMenuData, FlatedMenuConfig } from '../../route/menu';
import check from '../../component/authorized/checkPermissions';
import TableView, { TableConfig } from '../../component/tableView';
import renderHandler from '../../component/tableView/handler';
import styles from '../../component/tableView/index.less';

import renderExceptionPage from '../exception';

export interface TablePageProps {
  location: Location;
  history: History;
}

interface TablePageState {
  path: string;
}

export default class TablePage extends React.PureComponent<TablePageProps, TablePageState> {
  static childContextTypes = {
    config: PropTypes.object,
  };

  static defaultProps = {
    location: {},
  };

  static propTypes = {
    location: PropTypes.object,
  };

  state = {
    path: '',
  };

  private config: TableConfig | null = null;
  private routeConfig: FlatedMenuConfig = flatedMenuData[location.pathname];

  getChildContext() {
    return {
      config: this.config,
    };
  }

  componentDidMount() {
    this.setConfig(this.props.location.pathname);
  }

  setConfig = (path: string): void => {
    const confpath = `${path.substr(1, path.length - 1)}`;

    if (!path || !confpath) {
      return;
    }

    try {
      this.routeConfig = flatedMenuData[path];
      this.config = require(`../${confpath}.ts`).default;
      this.setState({ path });
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

      if (!check(path, true, false)) {
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

  onTabClick = (path: string) => {
    this.props.history.push(path);
  }

  render() {
    if (!this.config) {
      return renderExceptionPage('404');
    }

    const { path } = this.routeConfig;
    const { handler, actionList } = this.config;

    return (
      <div className={classNames('tableview', styles.tableview)}>
        <Tabs
          animated={false}
          defaultActiveKey={path}
          onTabClick={this.onTabClick}
          tabBarExtraContent={handler && renderHandler({ handler, actionList })}
        >
          {this.renderTabs()}
        </Tabs>
      </div>
    );
  }
}
