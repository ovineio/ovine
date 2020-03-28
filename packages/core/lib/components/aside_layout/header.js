import { get } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { json2reactFactory } from "../../utils/tool";
import { Amis } from "../amis/schema";
import HeadItem from "./head_item";
import ItemMsg from "./item_msg";
import ItemSearch from "./item_search";
import ItemSetting from "./item_setting";
const j2r = json2reactFactory({
    'header-item': HeadItem,
    'item-msg': ItemMsg,
    'item-search': ItemSearch,
    'item-setting': ItemSetting,
    'amis-render': Amis,
});
export default (props) => {
    const { setLayout, asideFolded, themeNs, brand, items = [], showDevItem } = props;
    const toggleScreen = () => {
        setLayout((d) => {
            d.offScreen = !d.offScreen;
        });
    };
    const toggleAside = () => {
        setLayout((d) => {
            d.asideFolded = !d.asideFolded;
        });
    };
    const renderItems = () => {
        const lefts = [];
        const rights = [];
        items.forEach((item, index) => {
            item.key = index;
            if (get(item, 'align') === 'right') {
                rights.push(item);
            }
            else {
                lefts.push(item);
            }
        });
        return (React.createElement("div", { className: "collapse navbar-collapse" },
            React.createElement("div", { "data-code": showDevItem || 'true', className: "navbar-nav mr-auto" },
                React.createElement(HeadItem, { faIcon: asideFolded ? 'indent' : 'dedent', tip: `${asideFolded ? '展开' : '收起'}侧边栏`, onClick: toggleAside }),
                lefts.map(j2r)),
            rights.map(j2r)));
    };
    const renderBrand = () => {
        const { logo, title, link, className: brandCls = '' } = brand;
        const wrapperCls = `${themeNs}Layout-brand navbar-brand text-center ${brandCls}`;
        const content = (React.createElement(React.Fragment, null,
            React.createElement("img", { className: "inline brand-logo", src: logo, alt: "logo" }),
            React.createElement("span", { className: "hidden-folded m-l-sm inline" }, title)));
        if (!link) {
            return React.createElement("div", { className: wrapperCls }, content);
        }
        return (React.createElement(Link, { className: wrapperCls, to: link.href, title: link.title }, content));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `${themeNs}Layout-brandBar navbar-dark` },
            React.createElement("button", { className: "navbar-toggler d-block d-sm-none float-right", type: "button", onClick: toggleScreen },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            brand && renderBrand()),
        React.createElement("div", { className: `${themeNs}Layout-headerBar navbar navbar-expand-lg` }, renderItems())));
};
