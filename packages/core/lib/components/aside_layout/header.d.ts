/// <reference types="react" />
import { LayoutCommProps, HeaderProps } from "./types";
declare type Props = LayoutCommProps & Partial<HeaderProps> & {
    themeNs: string;
    themeName: string;
};
declare const _default: (props: Props) => JSX.Element;
export default _default;
