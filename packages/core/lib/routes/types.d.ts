import { LinkItem } from 'amis/lib/components/AsideNav';
import { RouteProps } from 'react-router-dom';
import { AmisProps } from "../components/amis/schema";
export declare type Limit = {
    label: string;
    icon?: string;
    needs?: string[];
    description?: string;
};
export declare type LimitSchema = {
    limits?: string | string[];
    limitsLogic?: 'and' | 'or';
};
export declare type PagePreset = {
    nodePath?: string;
    limits?: Types.ObjectOf<Limit>;
    apis?: Types.ObjectOf<Req.Option & LimitSchema & {
        key?: string;
    }>;
};
export declare type RouteItem = Omit<LinkItem, 'children' | 'component'> & Pick<RouteProps, 'component' | 'exact' | 'sensitive' | 'strict'> & PagePreset & {
    nodePath: string;
    badge?: number;
    badgeClassName?: string;
    pathToComponent?: boolean | string;
    children?: RouteItem[];
    sideVisible?: boolean;
    limitOnly?: boolean;
};
export declare type LimitMenuItem = Omit<RouteItem, 'apis'> & Limit & {
    disabled?: boolean;
    apis?: Types.ObjectOf<{
        url: string;
        key?: string;
        limits?: string | string[];
    }>;
};
export declare type PageFileOption = Partial<Pick<RouteItem, 'path' | 'pathToComponent' | 'nodePath'>>;
export declare type PresetRouteProps = Omit<RouteProps, 'path'> & PageFileOption & {
    withSuspense?: boolean;
    fallback?: any;
};
export declare type PageProps = Omit<RouteItem, keyof PagePreset> & PresetRouteProps;
export declare type PresetComponentProps = PresetRouteProps & PageFileOption & {
    LazyFileComponent?: any;
    RouteComponent?: any;
    lazyFileAmisProps?: AmisProps;
};
export declare type CheckLimitFunc = (limitKeys?: string | string[], option?: {
    nodePath?: string;
    limits?: any;
}) => boolean;
export declare type PresetCtxState = PagePreset;
//# sourceMappingURL=types.d.ts.map