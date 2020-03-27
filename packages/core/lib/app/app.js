import defaultsDeep from 'lodash/defaultsDeep';
import React from 'react';
import { render } from 'react-dom';
import "../routes/exports";
import { App } from "../components/app";
import { appRootId } from "../constants";
import { initAppTheme } from "../styled/theme";
import { setConfig } from "../utils/logger";
import { getQuery } from "../utils/tool";
function initLogger(config = {}) {
    const moduleName = getQuery('loggerModule') || config.moduleName;
    const debugLevel = getQuery('loggerLevel') || config.level;
    const loggerConfig = defaultsDeep({
        moduleName,
        level: debugLevel,
        enable: !!moduleName,
    }, config);
    setConfig(loggerConfig);
}
function renderApp() {
    const $mounted = document.getElementById(appRootId);
    render(React.createElement(App, null), $mounted);
}
export function initApp() {
    initLogger();
    initAppTheme();
    renderApp();
}
// Hot Module Replacement API
const { hot } = module;
if (hot) {
    hot.accept('../components/app', renderApp);
}
