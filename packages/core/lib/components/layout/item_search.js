/**
 * APP 搜索
 */
import { findTree } from 'amis/lib/utils/helper';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getAsideMenus } from "../../routes/limit";
import { useImmer } from "../../utils/hooks";
import { cls } from "../../utils/tool";
import { Amis } from "../amis/schema";
import HeadItem from "./head_item";
import { SearchInput } from "./styled";
export default (function () {
    var _a = useImmer({
        value: '',
        isInputActive: false,
    }), state = _a[0], setState = _a[1];
    var history = useHistory();
    var isInputActive = state.isInputActive;
    var asideMenus = getAsideMenus();
    var inputSchema = {
        title: '',
        type: 'form',
        mode: 'normal',
        wrapWithPanel: false,
        autoFocus: true,
        className: 'm-n',
        actions: [],
        controls: [
            {
                type: 'tree-select',
                name: 'nodePath',
                label: '',
                className: cls('m-n', { active: isInputActive }),
                inputClassName: 'search-input',
                searchable: true,
                valueField: 'nodePath',
                placeholder: '搜索侧边栏...',
                options: asideMenus,
            },
        ],
        onChange: function (formValue) {
            var nodePath = formValue.nodePath;
            var nodeItem = findTree(asideMenus, function (item) { return nodePath === item.nodePath; });
            if (!nodeItem) {
                return;
            }
            // 直接跳转指定页面
            if (nodeItem.path) {
                history.push(nodeItem.path);
                //
            }
            else if (nodeItem.children) {
                // 查找第一个 具有path 的节点，并跳转
                var pathItem = findTree(nodeItem.children, function (item) { return !!item.path; });
                if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.path) {
                    history.push(pathItem.path);
                }
            }
        },
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(HeadItem, { faIcon: "search", tip: "\u641C\u7D22", onClick: function () {
                setState(function (d) {
                    d.isInputActive = !d.isInputActive;
                });
            } }),
        React.createElement(SearchInput, null,
            React.createElement(Amis, { schema: inputSchema }))));
});
