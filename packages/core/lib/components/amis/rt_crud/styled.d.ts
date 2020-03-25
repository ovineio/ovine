import { DefaultTheme } from 'styled-components';
declare type CssProps = DefaultTheme & {
    tableWidth: number;
};
export declare const crudCss: ({ tableWidth, ns, colors }: CssProps) => import("styled-components").FlattenSimpleInterpolation;
export {};
