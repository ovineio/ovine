import React, { PureComponent, createElement } from 'react';
import { Breadcrumb } from 'antd';
import classNames from 'classnames';
import { urlToList } from '../util/pathTools';
import { flatedMenuData } from '../../route/menu';
import styles from './breadcrumb.less';


export function getBreadcrumb(url) {
  if (!url) return;
  let breadcrumb = null;

  breadcrumb = flatedMenuData[url];
  return breadcrumb || {};
}

export default class Mbreadcrumb extends PureComponent {
  getBreadcrumbProps = () => {
    return {
      routerLocation: this.props.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap,
    };
  };
  // Generated according to  props
  conversionFromProps = () => {
    const {
      breadcrumbList,
      breadcrumbSeparator,
      linkElement = 'a',
    } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href
              ? createElement(
                  linkElement,
                  {
                    [linkElement === 'a' ? 'href' : 'to']: item.href,
                  },
                  item.title,
                )
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };
  conversionFromLocation = (routerLocation) => {
    const { breadcrumbSeparator, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(url);
      const isLinkable =
        index !== pathSnippets.length - 1 &&
          (currentBreadcrumb.component || currentBreadcrumb.isTableView);
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name,
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    // extraBreadcrumbItems.unshift(
    //   <Breadcrumb.Item key="home">
    //     {createElement(
    //       linkElement,
    //       {
    //         [linkElement === 'a' ? 'href' : 'to']: '/',
    //       },
    //       'Dashboard',
    //     )}
    //   </Breadcrumb.Item>,
    // );
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };
  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList } = this.props;
    const {
      routerLocation,
    } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }

    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation);
    }
    return null;
  };
  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName,
      )
    );
  };

  render() {
    const {
      className,
    } = this.props;
    const clsString = classNames(styles.breadcrumbwrap, className);
    const breadcrumb = this.conversionBreadcrumbList();

    return (
      <div className={clsString}>
        {breadcrumb}
      </div>
    );
  }
}
