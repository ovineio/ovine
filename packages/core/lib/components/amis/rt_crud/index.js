/**
 * 自定义 crud 组件
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Renderer } from 'amis';
import { get } from 'lodash';
import { css } from 'styled-components';
import { breakpoints } from "../../../constants";
import { crudCss } from "./styled";
const getAmisCrudSchema = (props) => {
    const { tableClassName = '', filter, headerToolbar = [] } = props, rest = __rest(props, ["tableClassName", "filter", "headerToolbar"]);
    const isSmScreen = window.innerWidth < breakpoints.md;
    // 在小屏幕中 自动加入分页
    if (isSmScreen &&
        !headerToolbar.find((i) => i === 'pagination' || get(i, 'type') === 'pagination')) {
        headerToolbar.push({
            type: 'pagination',
            align: 'right',
        });
    }
    const crudSchema = Object.assign(Object.assign({ keepItemSelectionOnPageChange: true }, rest), { type: 'crud', className: 'rt-crud r', tableClassName: `rt-crud-table ${tableClassName}`, affixHeader: isSmScreen, headerToolbar, filter: Object.assign(Object.assign({}, filter), { title: '', submitText: '', wrapWithPanel: false }) });
    return crudSchema;
};
const RtCrud = (props) => {
    const { css: getCss, render, className, htmlClassName, tableWidth = 800 } = props;
    const amisCurd = {
        className,
        type: 'rt-css',
        htmlClassName,
        css: (theme) => css `
      ${crudCss(Object.assign(Object.assign({}, theme), { tableWidth }))};
      ${!getCss ? null : typeof getCss === 'string' ? getCss : getCss(theme)};
    `,
        body: getAmisCrudSchema(props),
    };
    return render('body', amisCurd);
};
Renderer({
    test: /(^|\/)rt-crud$/,
    name: 'rt-crud',
})(RtCrud);
