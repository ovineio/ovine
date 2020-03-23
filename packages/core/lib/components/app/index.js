import { AlertComponent, ToastComponent } from 'amis';
import get from 'lodash/get';
import React, { createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { app } from "../../app";
import { Amis } from "../amis/schema";
import AsideLayout from "../aside_layout";
import { message } from "../../constants";
import { PrestRoute, PrivateRoute } from "../../routes/route";
import GlobalStyle from "../../styled/global";
import { useImmer, useSubscriber } from "../../utils/hooks";
import logger from "../../utils/logger";
import { json2reactFactory } from "../../utils/tool";
const log = logger.getLogger('lib:components:app');
const initState = {
    theme: app.theme.getTheme().name,
    lang: 'zh_CN',
};
const AppContext = createContext(initState);
const j2r = json2reactFactory({
    route: Route,
    'private-route': PrivateRoute,
    'preset-route': PrestRoute,
    'aside-layout': AsideLayout,
    'amis-render': Amis,
});
export const useAppContext = () => useContext(AppContext);
export const App = () => {
    const [state, setState] = useImmer(initState);
    const { theme } = state;
    useEffect(() => {
        log.log('App Mounted.');
    }, []);
    useSubscriber([message.appTheme, message.appLang], (newValue, key) => {
        setState((d) => {
            switch (key) {
                case message.appTheme:
                    d.theme = newValue;
                    break;
                case message.appLang:
                    d.lang = newValue;
                    break;
                default:
            }
        });
    });
    const getTheme = () => {
        const themes = app.theme.getAllThemes();
        const appTheme = themes[theme];
        if (!appTheme) {
            log.warn(`appTheme 不在 主题列表中: ${Object.keys(themes)}, 已经自动设置为 default 主题`);
        }
        return appTheme || get(themes, 'default', {});
    };
    return (React.createElement(BrowserRouter, null,
        React.createElement(ToastComponent, { closeButton: true, theme: theme, timeout: 1500, className: "m-t-xl" }),
        React.createElement(AlertComponent, { theme: theme }),
        React.createElement(AppContext.Provider, { value: state },
            React.createElement(ThemeProvider, { theme: getTheme() },
                React.createElement(GlobalStyle, null),
                React.createElement(Switch, null, app.entry.map(j2r))))));
};
