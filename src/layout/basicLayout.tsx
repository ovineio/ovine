import * as React from 'react';
import PropTypes from 'prop-types';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import { Location } from 'history';
import config from 'config';

import GlobalHeader from '../component/globalHeader';
import SiderMenu from '../component/siderMenu';
import NotFound from '../page/exception';

import getRoute from '../route/getRoute';
import { formaterMenuData } from '../route/menu';
import Authorized from '../util/authorized';
import { getUserInfo } from '../util/storage';

import logo from '../asset/image/logo.png';
import defAvatar from '../asset/image/def-avator.jpeg';

const { appTitle } = config;
const { Content, Header } = Layout;
const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData: any[] = [];
const getRedirect = (item: any) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children: any) => {
        getRedirect(children);
      });
    }
  }
};

formaterMenuData.forEach(getRedirect);

const query: any = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile: boolean;
enquireScreen((b: boolean) => {
  isMobile = b;
});

type BasicLayoutProps = {
  dispatch: (args: any) => void;
  collapsed: boolean;
  location: Location;
  routerData: any;
  match: {
    path: string;
  };
};

type BasicLayoutState = {
  isMobile: boolean;
};

type BaseLayoutContext = {
  location: Location;
  breadcrumbNameMap: Object;
};

@connect(({ global = {} }: any) => ({
  collapsed: global.collapsed,
}))
export default class BasicLayout extends React.PureComponent<BasicLayoutProps, BasicLayoutState> {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
  };

  getChildContext(): BaseLayoutContext {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  componentDidMount() {
    enquireScreen((mobile: boolean) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/isLogin',
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = appTitle;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${appTitle}`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/dashboard';
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed: boolean) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleNoticeClear = (type: string) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleMenuClick = ({ key }: any) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'user/logout',
      });
    }
  }
  handleNoticeVisibleChange = (visible: boolean) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  render() {
    const { collapsed, routerData, match, location } = this.props;
    const { real_name = '', avatar = defAvatar } = getUserInfo() || {};

    const currentUser = {
      avatar,
      name: real_name,
    };
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={formaterMenuData}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout className="app-layout" style={{ background: '#ddd' }}>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              location={location}
            />
          </Header>
          <Content style={{ margin: '10px 15px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoute(match.path, routerData).map((item: any) => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {args => <div className={classNames(args)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
