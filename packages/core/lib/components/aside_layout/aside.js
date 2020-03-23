import { AsideNav } from 'amis';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getRoutePath } from "../../routes/exports";
const renderNav = ({ link, toggleExpand, classnames: cx }) => {
    const { children: routeChildren, icon, label, badge, badgeClassName, path } = link;
    const children = [];
    if (routeChildren) {
        children.push(React.createElement("span", { key: "expand-toggle", className: cx('AsideNav-itemArrow'), onClick: (e) => toggleExpand(link, e) }));
    }
    if (badge) {
        children.push(React.createElement("b", { key: "badge", className: cx('AsideNav-itemBadge', badgeClassName || 'bg-info') }, badge));
    }
    if (icon) {
        children.push(React.createElement("i", { key: "icon", className: cx('AsideNav-itemIcon', icon) }));
    }
    if (label) {
        children.push(React.createElement("span", { className: cx('AsideNav-itemLabel'), key: "label" }, label));
    }
    if (!path) {
        return (
        // eslint-disable-next-line
        React.createElement("a", { onClick: routeChildren ? () => toggleExpand(link) : undefined }, children));
    }
    return React.createElement(Link, { to: getRoutePath(path) }, children);
};
export default ({ theme, asideMenus }) => {
    const location = useLocation();
    const isActive = (link) => {
        return link.path && !!(getRoutePath(link.path) === location.pathname);
    };
    return (React.createElement(AsideNav, { theme: theme, renderLink: renderNav, isActive: isActive, navigations: asideMenus }));
};
