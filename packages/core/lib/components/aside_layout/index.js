/**
 * App Aside Menu布局
 */
import { Layout } from 'amis';
import React, { useMemo } from 'react';
import { withAppTheme } from "../../app/theme";
import { setRoutesConfig } from "../../routes/config";
import { getAuthRoutes, getAsideMenus } from "../../routes/limit";
import { AppMenuRoutes } from "../../routes/route";
import { useImmer } from "../../utils/hooks";
import logger from "../../utils/logger";
import { Amis } from "../amis/schema";
import Aside from "./aside";
import Header from "./header";
import { LayoutLoading } from "./loading";
import { StyledLayout } from "./styled";
const initState = {
    asideFolded: false,
    offScreen: false,
};
const log = logger.getLogger('lib:components:asideLayout');
export default withAppTheme((props) => {
    const [state, setState] = useImmer(initState);
    const { header, routes = [], footer, theme } = props;
    const { asideFolded, offScreen } = state;
    const { ns: themeNs, name: themeName } = theme;
    const headerProps = Object.assign(Object.assign(Object.assign({}, header), state), { setLayout: setState });
    const { authRoutes, asideMenus } = useMemo(() => {
        setRoutesConfig(routes);
        const configs = {
            authRoutes: getAuthRoutes(),
            asideMenus: getAsideMenus(),
        };
        log.log('routeConfig', configs);
        return configs;
    }, [routes]);
    return (React.createElement(StyledLayout, null,
        React.createElement(Layout, { headerFixed: true, contentClassName: "app-layout-body", theme: themeName, folded: asideFolded, offScreen: offScreen, header: React.createElement(Header, Object.assign({}, headerProps, { themeNs: themeNs, themeName: theme.name })), aside: React.createElement(Aside, { theme: themeName, asideMenus: asideMenus }), footer: footer && React.createElement(Amis, { schema: footer }) },
            React.createElement(LayoutLoading, { theme: themeName }),
            React.createElement(AppMenuRoutes, { authRoutes: authRoutes }),
            props.children)));
});
