/**
 * APP 系统设置
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { toast, Drawer } from 'amis';
import map from 'lodash/map';
import React from 'react';
import { app } from "../../app";
import { withAppTheme } from "../../app/theme";
import { Amis } from "../amis/schema";
import LimitSetting from "../limit_setting";
import { changeAppTheme } from "../../styled/theme";
import { useImmer } from "../../utils/hooks";
import HeadItem from "./head_item";
var initState = {
    settingVisible: false,
    limitVisible: false,
};
export default withAppTheme(function (props) {
    var _a = useImmer(initState), state = _a[0], setState = _a[1];
    var theme = props.theme;
    var settingVisible = state.settingVisible, limitVisible = state.limitVisible;
    var toggleSetting = function () {
        setState(function (d) {
            d.settingVisible = !d.settingVisible;
        });
    };
    var toggleLimitDialog = function () {
        setState(function (d) {
            d.limitVisible = !d.limitVisible;
        });
    };
    var limitDialog = {
        type: 'dialog',
        title: '测试权限设置',
        show: limitVisible,
        onClose: toggleLimitDialog,
        size: 'md',
        showCloseButton: false,
        data: {
            isTestLimit: true,
        },
        body: {
            component: LimitSetting,
        },
        actions: [],
    };
    var settingPanelProps = __assign(__assign({}, props), { toggleSetting: toggleSetting,
        toggleLimitDialog: toggleLimitDialog, theme: theme.name });
    return (React.createElement(React.Fragment, null,
        React.createElement(HeadItem, { faIcon: "cog", tip: "\u8BBE\u7F6E", onClick: toggleSetting }),
        React.createElement(Drawer, { closeOnOutside: true, size: "sm", theme: theme.name, onHide: toggleSetting, show: settingVisible, position: "right" },
            React.createElement(SettingPanel, __assign({}, settingPanelProps))),
        React.createElement(Amis, { schema: limitDialog })));
});
var SettingPanel = function (option) {
    var theme = option.theme, toggleSetting = option.toggleSetting, toggleLimitDialog = option.toggleLimitDialog;
    var onClearCache = function () {
        toggleSetting();
        localStorage.clear();
        sessionStorage.clear();
        toast.success('缓存已经被清理', '操作成功');
        // setTimeout(userLogout, 1000)
    };
    var onChangeTheme = function (choseTheme, prevTheme) {
        if (!prevTheme) {
            return;
        }
        if (choseTheme !== prevTheme) {
            toggleSetting();
            changeAppTheme(choseTheme);
        }
    };
    var devItems = [];
    if (!app.env.isRelease) {
        devItems = [
            { type: 'divider' },
            {
                type: 'rt-blank',
                label: '测试权限',
                name: '',
                className: 'from-item-button',
                body: {
                    type: 'button',
                    icon: 'fa fa-lock',
                    label: '编辑权限',
                    onClick: function () {
                        toggleSetting();
                        toggleLimitDialog();
                    },
                },
            },
        ];
    }
    var schema = {
        css: "\n      .from-item-button {\n        .form-control-static {\n          padding: 0;\n        }\n      }\n    ",
        type: 'wrapper',
        className: 'no-bg-c',
        body: [
            {
                type: 'html',
                html: '<div class="m-t-xs m-b-lg"><i class="fa fa-cog p-r-xs"></i><span>系统设置</span></div>',
            },
            {
                type: 'form',
                mode: 'horizontal',
                horizontal: { left: 'col-sm-4', right: 'col-sm-8' },
                wrapWithPanel: false,
                data: {
                    theme: theme,
                },
                controls: __spreadArrays([
                    {
                        type: 'select',
                        name: 'theme',
                        label: '选择主题',
                        options: map(app.theme.getAllThemes(), function (_a, key) {
                            var text = _a.text;
                            return ({
                                label: text,
                                value: key,
                            });
                        }),
                        onChange: onChangeTheme,
                    },
                    {
                        type: 'rt-blank',
                        name: '',
                        label: '系统缓存',
                        className: 'from-item-button',
                        body: {
                            type: 'button',
                            icon: 'fa fa-trash-o',
                            label: '清除',
                            confirmText: '本地缓存数据将被删除，需要重新登录，确认清除？',
                            onAction: onClearCache,
                        },
                    }
                ], devItems),
            },
        ],
    };
    return React.createElement(Amis, { schema: schema });
};
