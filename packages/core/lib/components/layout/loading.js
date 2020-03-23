import { Spinner } from 'amis';
import React, { useEffect, useState } from 'react';
import { message } from "../../constants";
import { useSubscriber } from "../../utils/hooks";
import { toggleLayoutLoading } from "./exports";
export var LayoutLazyFallback = function () {
    useEffect(function () {
        var closed = false;
        // 不显示 50 毫秒内的 loading
        setTimeout(function () {
            toggleLayoutLoading(!closed && true);
        }, 50);
        return function () {
            closed = true;
            toggleLayoutLoading(false);
        };
    }, []);
    return null;
};
export var LayoutLoading = function (_a) {
    var theme = _a.theme;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    useSubscriber(message.layoutSpinner, function (toggle) {
        setLoading(toggle);
    });
    return React.createElement(Spinner, { overlay: true, show: loading, theme: theme, size: "lg", key: "pageLoading" });
};
