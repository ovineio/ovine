import { Drawer, Spinner } from 'amis';
import { Editor } from 'amis/lib/components';
import cloneDeep from 'lodash/cloneDeep';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Portal } from 'react-overlays';
import HeadItem from "../../aside_layout/head_item";
import { PopupItemMenu } from "../../aside_layout/styled";
import { storage } from "../../../constants";
import { getRouteConfig } from "../../../routes/config";
import { getStore } from "../../../utils/store";
const transSchema = (schema) => {
    if (!isObject(schema)) {
        return;
    }
    map(schema, (val, key) => {
        if (isFunction(val)) {
            ;
            schema[key] = 'Function Body';
        }
        else if (isObject(val)) {
            transSchema(val);
        }
    });
};
export const containerSelector = '.navbar-nav[data-code="true"]';
export default (props) => {
    const { theme, schema } = props;
    const [show, toggle] = useState(false);
    const [code, setCode] = useState('page');
    const [loading, toggleLoading] = useState(false);
    const storeRef = useRef({});
    const toggleDrawer = () => toggle((t) => !t);
    useEffect(() => {
        if (!window.monaco) {
            toggleLoading(true);
        }
    }, []);
    const onEditorMounted = () => {
        if (loading && window.monaco) {
            toggleLoading(false);
        }
    };
    const cachedSchema = useMemo(() => {
        var _a, _b;
        let json = {};
        if (storeRef.current[code]) {
            return storeRef.current[code];
        }
        switch (code) {
            case 'page':
                json = cloneDeep(schema);
                transSchema(json);
                break;
            case 'route':
                json = cloneDeep(getRouteConfig());
                transSchema(json);
                break;
            case 'limit':
                json = {
                    authLimits: (_a = getStore(storage.dev.limit)) === null || _a === void 0 ? void 0 : _a.split(','),
                    authApis: (_b = getStore(storage.dev.api)) === null || _b === void 0 ? void 0 : _b.split(','),
                };
                break;
            default:
        }
        const jsonStr = JSON.stringify(json);
        storeRef.current[code] = jsonStr;
        return jsonStr;
    }, [schema, code]);
    const viewCode = (codeType) => {
        setCode(codeType);
        toggleDrawer();
    };
    return (React.createElement(Portal, { container: () => $(containerSelector).get(0) },
        React.createElement(Drawer, { closeOnOutside: true, theme: theme, size: "lg", onHide: toggleDrawer, show: show, position: "left" },
            React.createElement(Spinner, { overlay: true, show: show && loading, size: "lg" }),
            show && (React.createElement(Editor, { editorDidMount: onEditorMounted, options: { readOnly: true }, editorTheme: theme === 'dark' ? 'vs-dark' : 'vs', language: "json", value: cachedSchema }))),
        React.createElement(HeadItem, { faIcon: "code", tip: "\u67E5\u770B\u4EE3\u7801", trigger: "focus", triggerContent: React.createElement(PopupItemMenu, null,
                React.createElement("ul", null,
                    React.createElement("li", { onClick: () => viewCode('page') },
                        React.createElement("i", { className: "fa fa-file-code-o" }),
                        React.createElement("span", null, "\u672C\u9875\u9762JSON")),
                    React.createElement("li", { onClick: () => viewCode('route') },
                        React.createElement("i", { className: "fa fa-code-fork" }),
                        React.createElement("span", null, "APP\u8DEF\u7531\u914D\u7F6E")),
                    React.createElement("li", { onClick: () => viewCode('limit') },
                        React.createElement("i", { className: "fa fa-unlock" }),
                        React.createElement("span", null, "\u5F53\u524D\u62E5\u6709\u6743\u9650")))) })));
};
