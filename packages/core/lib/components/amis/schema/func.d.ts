/// <reference types="react" />
import { RendererConfig } from 'amis/lib/factory';
import { Schema } from 'amis/lib/types';
import { DefaultTheme } from 'styled-components';
import { RtSchema, SchemaPreset } from "./types";
export declare const filterSchemaLimit: (schema: RtSchema, option: {
    nodePath?: string | undefined;
}) => void;
export declare const convertToAmisSchema: (schema: RtSchema, option: {
    preset?: SchemaPreset | undefined;
}) => RtSchema;
export declare const resolveRtSchema: (schema: RtSchema) => {
    type: string;
    detectField?: string | undefined;
    visibleOn?: string | undefined;
    hiddenOn?: string | undefined;
    children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null | undefined;
    definitions?: import("amis/lib/types").Definitions | undefined;
    limits?: string | string[] | undefined;
    limitsLogic?: "and" | "or" | undefined;
    preset: SchemaPreset;
};
export declare const envResolver: (option: {
    path: string;
    schema?: Schema | undefined;
    props?: any;
    theme: DefaultTheme;
}) => RendererConfig | null;
export declare const wrapCss: (schema: RtSchema) => RtSchema;
export declare const normalizeLink: (option: {
    location?: any;
    to?: any;
}) => {
    href: any;
    pathname: any;
    search: any;
    hash: any;
};
