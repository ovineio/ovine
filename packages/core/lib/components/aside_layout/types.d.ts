import { RouteItem } from "../../routes/types";
import { ImmerSetter } from "../../utils/hooks";
import { RtSchema } from "../amis/schema/types";
export declare type LayoutState = {
    asideFolded: boolean;
    offScreen: boolean;
};
export declare type LayoutCommProps = LayoutState & {
    setLayout: ImmerSetter<LayoutState>;
};
export declare type HederBrandProps = {
    logo: string;
    title: string;
    className?: string;
    link?: {
        title?: string;
        href: string;
    };
};
export declare type HeaderProps = {
    brand: HederBrandProps;
    items?: any[];
    showDevItem?: boolean;
};
export declare type LayoutProps = {
    children?: any;
    layoutKey?: string;
    header?: HeaderProps;
    footer?: RtSchema;
    routes?: RouteItem[];
};
//# sourceMappingURL=types.d.ts.map