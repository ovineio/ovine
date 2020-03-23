/**
 * App头部工具 ICON 按钮
 */
import { Button, TooltipWrapper } from 'amis';
import React from 'react';
import { withAppTheme } from "../../app/theme";
export default withAppTheme(function (props) {
    var theme = props.theme, _a = props.className, className = _a === void 0 ? '' : _a, tooltipClassName = props.tooltipClassName, icon = props.icon, faIcon = props.faIcon, trigger = props.trigger, triggerContent = props.triggerContent, children = props.children, onClick = props.onClick, href = props.href, tip = props.tip;
    // TODO: trigger === focus 时 有兼容问题
    var isClickOpen = trigger === 'click';
    var withContent = trigger || undefined;
    var toolTip = withContent && {
        render: function () { return triggerContent; },
    };
    var onItemClick = function (e) {
        if (href) {
            window.open(href, '_blank');
        }
        if (onClick) {
            onClick(e);
        }
    };
    var button = (React.createElement(Button, { iconOnly: true, className: "nav-item no-shadow " + className, theme: theme.name, level: "link", placement: "bottom", onClick: onItemClick, tooltipTrigger: withContent && trigger, tooltip: !isClickOpen ? toolTip : undefined },
        (icon || faIcon) && (React.createElement("i", { className: icon || (faIcon ? "fa fa-" + faIcon + " fa-fw" : ''), "data-position": "bottom", "data-tooltip": tip })),
        !tip ? (children) : (React.createElement("div", { "data-tooltip": tip, "data-position": "bottom" }, children))));
    if (!isClickOpen) {
        return button;
    }
    return (React.createElement(TooltipWrapper, { rootClose: true, placement: "bottom", trigger: "click", theme: theme.name, tooltip: toolTip, tooltipClassName: tooltipClassName }, button));
});
