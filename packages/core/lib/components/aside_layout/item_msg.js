/**
 * APP 消息通知
 */
import { Tab, Tabs } from 'amis';
import React from 'react';
import { withAppTheme } from "../../app/theme";
import { useImmer } from "../../utils/hooks";
import HeadItem from "./head_item";
import { PopupMsgMenu } from "./styled";
export default () => {
    return (React.createElement(HeadItem, { faIcon: "bell", tip: "\u6D88\u606F", trigger: "click", tooltipClassName: "app-tool-tip", triggerContent: React.createElement(MsgContent, null) }));
};
const MsgContent = withAppTheme((props) => {
    const [state, setState] = useImmer({
        activeTab: 'notify',
    });
    const { activeTab } = state;
    const onTabSelect = (tab) => {
        setState((d) => {
            d.activeTab = tab;
        });
    };
    return (React.createElement(PopupMsgMenu, null,
        React.createElement(Tabs, { theme: props.theme.name, mode: "line", activeKey: activeTab, onSelect: onTabSelect },
            React.createElement(Tab, { eventKey: "notify", title: "\u901A\u77E5" }, "\u901A\u77E5\u6A21\u5757\uFF0C\u8BE5\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D..."),
            React.createElement(Tab, { eventKey: "message", title: "\u6D88\u606F" }, "\u6D88\u606F\u6A21\u5757\uFF0C\u8BE5\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D..."),
            React.createElement(Tab, { eventKey: "unprocessed", title: "\u5F85\u5904\u7406" }, "\u5F85\u5904\u7406\u6A21\u5757\uFF0C\u8BE5\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D..."))));
});
