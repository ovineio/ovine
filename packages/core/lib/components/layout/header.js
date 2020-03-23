var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { Link } from 'react-router-dom';
import { withAppTheme } from "../../app/theme";
import HeadItem from "./head_item";
import ItemMsg from "./item_msg";
import ItemSearch from "./item_search";
import ItemSetting from "./item_setting";
import ItemUser from "./item_user";
export default withAppTheme(function (props) {
    var setLayout = props.setLayout, asideFolded = props.asideFolded, theme = props.theme;
    var toggleScreen = function () {
        setLayout(function (d) {
            d.offScreen = !d.offScreen;
        });
    };
    var logoUrl = '';
    var title = '';
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: theme.ns + "Layout-brandBar navbar-dark" },
            React.createElement("button", { className: "navbar-toggler d-block d-sm-none float-right", type: "button", onClick: toggleScreen },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement(Link, { className: theme.ns + "Layout-brand app-layout-brand", to: "/", title: "Dashboard" },
                React.createElement("img", { className: "inline brand-logo", src: logoUrl, alt: "logo" }),
                React.createElement("span", { className: "hidden-folded m-l-sm inline" }, title))),
        React.createElement("div", { className: theme.ns + "Layout-headerBar navbar navbar-expand-lg" },
            React.createElement("div", { className: "collapse navbar-collapse" },
                React.createElement("div", { id: "app-header-left", className: "navbar-nav mr-auto" },
                    React.createElement(HeadItem, { faIcon: asideFolded ? 'indent' : 'dedent', tip: (asideFolded ? '展开' : '收起') + "\u4FA7\u8FB9\u680F", onClick: function () {
                            return setLayout(function (d) {
                                d.asideFolded = !d.asideFolded;
                            });
                        } }),
                    React.createElement(HeadItem, { tip: "github\u4ED3\u5E93", faIcon: "github", href: "https://github.com/CareyToboo/rt-admin" }),
                    React.createElement(HeadItem, { tip: "\u4F7F\u7528\u6587\u6863", faIcon: "question-circle-o", href: "http://rt-admin.igroupes.com/rtdocs/" })),
                React.createElement("div", { className: "d-none d-sm-block" },
                    React.createElement(ItemSearch, null),
                    React.createElement(ItemMsg, null),
                    React.createElement(ItemUser, null),
                    React.createElement(ItemSetting, __assign({}, props)))))));
});
