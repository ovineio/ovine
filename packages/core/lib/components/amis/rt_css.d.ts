/**
 * rt-css 样式渲染器
 * 可为组件 传入自定义 css
 */
import { RendererProps } from 'amis/lib/factory';
import React from 'react';
import { DefaultTheme, FlattenSimpleInterpolation } from 'styled-components';
declare type CssType = (theme: DefaultTheme) => FlattenSimpleInterpolation;
export declare type RtCssProps = RendererProps & {
    css?: string | CssType;
    htmlClassName?: string;
    tag?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
};
export {};
