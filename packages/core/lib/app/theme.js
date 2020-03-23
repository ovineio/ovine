import defaultsDeep from 'lodash/defaultsDeep';
import { withTheme } from 'styled-components';
import { storage } from "../constants";
import presetThemes from "../styled/themes";
import { getStore } from "../utils/store";
export const withAppTheme = withTheme;
export class AppTheme {
    constructor(initTheme, appThemes) {
        this.themes = presetThemes;
        this.initTheme = 'default';
        this.initTheme = getStore(storage.appTheme) || initTheme || 'default';
        this.themes = defaultsDeep(appThemes, this.themes);
    }
    initThemes(appThemes) {
        this.themes = defaultsDeep(appThemes, this.themes);
    }
    getTheme() {
        return Object.assign({ name: 'default' }, this.themes[this.initTheme]);
    }
    getAllThemes() {
        return this.themes;
    }
}
