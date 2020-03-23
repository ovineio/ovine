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
export default () => {
    const [state, setState] = useImmer({
        value: '',
        isInputActive: false,
    });
    const history = useHistory();
    const { isInputActive } = state;
    const asideMenus = getAsideMenus();
    const inputSchema = {
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
        onChange: (formValue) => {
            const { nodePath } = formValue;
            const nodeItem = findTree(asideMenus, (item) => nodePath === item.nodePath);
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
                const pathItem = findTree(nodeItem.children, (item) => !!item.path);
                if (pathItem === null || pathItem === void 0 ? void 0 : pathItem.path) {
                    history.push(pathItem.path);
                }
            }
        },
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(HeadItem, { faIcon: "search", tip: "\u641C\u7D22", onClick: () => {
                setState((d) => {
                    d.isInputActive = !d.isInputActive;
                });
            } }),
        React.createElement(SearchInput, null,
            React.createElement(Amis, { schema: inputSchema }))));
};
