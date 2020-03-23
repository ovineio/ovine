/**
 * App布局
 */
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
import { Layout } from 'amis';
import React from 'react';
import { withAppTheme } from "../../app/theme";
import { useImmer } from "../../utils/hooks";
import Aside from "./aside";
import Header from "./header";
import { LayoutLoading } from "./loading";
import { StyledLayout } from "./styled";
var initState = {
    asideFolded: false,
    offScreen: false,
    headerVisible: false,
};
export default withAppTheme(function (props) {
    var _a = useImmer(initState), state = _a[0], setState = _a[1];
    var asideFolded = state.asideFolded, offScreen = state.offScreen;
    var compProps = __assign(__assign({}, state), { setLayout: setState });
    var theme = props.theme.name;
    return (React.createElement(StyledLayout, null,
        React.createElement(Layout, { headerFixed: true, contentClassName: "app-layout-body", theme: theme, folded: asideFolded, offScreen: offScreen, header: React.createElement(Header, __assign({}, compProps)), aside: React.createElement(Aside, __assign({}, compProps)) },
            React.createElement(LayoutLoading, { theme: theme }),
            props.children)));
});
