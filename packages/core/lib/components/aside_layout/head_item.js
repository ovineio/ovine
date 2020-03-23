/**
 * App头部工具 ICON 按钮
 */
import { Button, TooltipWrapper } from 'amis';
import React from 'react';
import { withAppTheme } from "../../app/theme";
export default withAppTheme((props) => {
    const { theme, className = '', tooltipClassName, icon, faIcon, trigger, triggerContent, children, onClick, href, tip, } = props;
    // TODO: trigger === focus 时 有兼容问题
    const isClickOpen = trigger === 'click';
    const withContent = trigger || undefined;
    const toolTip = withContent && {
        render: () => triggerContent,
    };
    const onItemClick = (e) => {
        if (href) {
            window.open(href, '_blank');
        }
        if (onClick) {
            onClick(e);
        }
    };
    const button = (React.createElement(Button, { iconOnly: true, className: `nav-item no-shadow ${className}`, theme: theme.name, level: "link", placement: "bottom", onClick: onItemClick, tooltipTrigger: withContent && trigger, tooltip: !isClickOpen ? toolTip : undefined },
        !icon && !faIcon ? null : icon ? (React.createElement("i", { "data-position": "bottom", "data-tooltip": tip }, icon)) : (React.createElement("i", { className: `fa fa-${faIcon}`, "data-position": "bottom", "data-tooltip": tip })),
        !tip ? (children) : (React.createElement("div", { "data-tooltip": tip, "data-position": "bottom" }, children))));
    if (!isClickOpen) {
        return button;
    }
    return (React.createElement(TooltipWrapper, { rootClose: true, placement: "bottom", trigger: "click", theme: theme.name, tooltip: toolTip, tooltipClassName: tooltipClassName }, button));
});
