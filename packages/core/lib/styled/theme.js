import { theme as setAmisTheme } from 'amis';
import { app } from "../app";
import { themeNamePrefix, storage, message } from "../constants";
import { getThemeCss } from "../routes/exports";
import { publish } from "../utils/message";
import { setStore } from "../utils/store";
const loadingCls = 'theme-is-loading'; // 异步加载CSS，会导致页面抖动
const { name: storedTheme } = app.theme.getTheme();
const loadedCss = {
    [storedTheme]: true,
};
const pace = window.Pace;
export const changeAppTheme = (theme) => {
    const loading = !loadedCss[theme];
    let bodyCls = `${themeNamePrefix}${theme}`;
    if (loading) {
        pace.restart();
        bodyCls += ` ${loadingCls}`;
    }
    $('body').addClass(bodyCls);
    getThemeCss(theme);
    publish(message.appTheme, theme);
    setStore(storage.appTheme, theme);
    if (loading) {
        loadedCss[theme] = true;
        setTimeout(() => {
            $('body').removeClass(bodyCls);
            pace.stop();
        }, 1000);
    }
};
export const initAppTheme = () => {
    $('body').addClass(`${themeNamePrefix}${storedTheme}`);
    // 非amis主题 都需要注册
    Object.values(app.theme.getAllThemes())
        .filter((item) => !/cxd|default|dark/.test(item.name))
        .forEach((item) => {
        setAmisTheme(item.name, {
            classPrefix: item.ns,
        });
    });
    getThemeCss(storedTheme);
};
