import { AsideNav } from 'amis';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { withAppTheme } from "../../app/theme";
import { getRoutePath } from "../../routes/exports";
import { getAsideMenus } from "../../routes/limit";
var renderNav = function (_a) {
    var link = _a.link, toggleExpand = _a.toggleExpand, cx = _a.classnames;
    var routeChildren = link.children, icon = link.icon, label = link.label, badge = link.badge, badgeClassName = link.badgeClassName, path = link.path;
    var children = [];
    if (routeChildren) {
        children.push(React.createElement("span", { key: "expand-toggle", className: cx('AsideNav-itemArrow'), onClick: function (e) { return toggleExpand(link, e); } }));
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
        return (React.createElement("button", { type: "button", onClick: routeChildren ? function () { return toggleExpand(link); } : undefined }, children));
    }
    return React.createElement(Link, { to: getRoutePath(path) }, children);
};
export default withAppTheme(function (props) {
    var location = useLocation();
    return (React.createElement(AsideNav, { theme: props.theme.name, renderLink: renderNav, navigations: getAsideMenus(), isActive: function (link) { return !!(getRoutePath(link.path) === location.pathname); } }));
});
