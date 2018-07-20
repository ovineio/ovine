import * as React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Location } from 'history';
import config from 'config';

import logo from '../asset/image/logo.png';
import getRoute from '../route/getRoute';

import styles from './userLayout.less';
import { RouterData } from '../route/router';

const { appTitle, description } = config;

interface UserLayoutProps {
  routerData: RouterData;
  location: Location;
  match: {
    path: string;
  };
}

class UserLayout extends React.PureComponent<UserLayoutProps> {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = appTitle;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} -${appTitle}`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>{appTitle}</span>
                </Link>
              </div>
              <div className={styles.desc}>{description}</div>
            </div>
            <Switch>
              {getRoute(match.path, routerData).map((item: any) => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
