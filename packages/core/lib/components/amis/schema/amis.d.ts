/// <reference types="react" />
import { RenderOptions, RootRenderProps } from 'amis/lib/factory';
import { DefaultTheme } from 'styled-components';
import { RtSchema } from "./types";
declare type Option = {
    schema: RtSchema;
    theme: DefaultTheme;
    history: any;
    option?: RenderOptions;
    props?: RootRenderProps;
    [prop: string]: any;
};
declare const _default: (option: Option) => JSX.Element;
export default _default;
//# sourceMappingURL=amis.d.ts.map