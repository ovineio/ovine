/**
 * APP 登录用户信息
 */
import React from 'react';
import { useImmer } from "../../utils/hooks";
import { Amis } from "../amis/schema";
import HeadItem from "./head_item";
import { PopupItemMenu } from "./styled";
var initState = {
    infoVisible: false,
};
export default (function () {
    var _a = useImmer(initState), state = _a[0], setState = _a[1];
    var infoVisible = state.infoVisible;
    var toggleInfoDialog = function () {
        setState(function (d) {
            d.infoVisible = !d.infoVisible;
        });
    };
    var data = {
        avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
        nickname: '梦醒十分2323',
        signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
    };
    var infoDialog = {
        data: data,
        type: 'dialog',
        title: '您的个人信息',
        show: infoVisible,
        onClose: toggleInfoDialog,
        body: {
            type: 'form',
            controls: [
                {
                    type: 'image',
                    label: '头像',
                    name: 'avatar',
                },
                {
                    type: 'static',
                    name: 'nickname',
                    label: '昵称',
                    value: '文本',
                    quickEdit: true,
                },
                {
                    type: 'static',
                    name: 'signature',
                    label: '个性签名',
                    quickEdit: true,
                },
            ],
        },
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(HeadItem, { className: "no-padder m-l-sm", tip: "\u7528\u6237\u4FE1\u606F", trigger: "focus", triggerContent: React.createElement(PopupItemMenu, null,
                React.createElement("ul", null,
                    React.createElement("li", { onClick: toggleInfoDialog },
                        React.createElement("i", { className: "glyphicon glyphicon-user" }),
                        React.createElement("span", null, "\u67E5\u770B\u4FE1\u606F")),
                    React.createElement("li", null,
                        React.createElement("i", { className: "glyphicon glyphicon-log-out" }),
                        React.createElement("span", null, "\u9000\u51FA\u767B\u5F55")))) },
            React.createElement("img", { className: "w-2x m-r-xs", src: "https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg", alt: "avatar" }),
            React.createElement("span", null, "\u68A6\u9192\u5341\u5206")),
        React.createElement(Amis, { schema: infoDialog })));
});
