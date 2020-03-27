import { RendererProps, RenderOptions } from 'amis/lib/factory';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RtSchema } from "./types";
export declare type AmisProps = {
    schema: RtSchema;
    props?: RendererProps;
    option?: RenderOptions;
};
declare type Props = AmisProps & RouteComponentProps<any>;
export declare const Amis: React.ComponentClass<Pick<Props, "schema" | "props" | "option">, any> & import("react-router").WithRouterStatics<(props: Props) => JSX.Element>;
export {};
