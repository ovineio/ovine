import { FunctionComponent } from 'react';
import { DefaultTheme } from 'styled-components';
import * as Types from "../utils/types";
declare type Themes = {
    default: DefaultTheme;
    [theme: string]: Types.DeepPartial<DefaultTheme>;
};
declare type WithAppTheme = <P, C = FunctionComponent<P & {
    theme: DefaultTheme;
}>>(component: C) => FunctionComponent<P>;
export declare const withAppTheme: WithAppTheme;
export declare class AppTheme {
    private themes;
    private initTheme;
    constructor(initTheme?: string, appThemes?: Themes);
    initThemes(appThemes: Themes): void;
    getTheme(): DefaultTheme;
    getAllThemes(): Types.ObjectOf<DefaultTheme>;
}
export {};
