import { ImmerSetter } from "../../utils/hooks";
export declare type LayoutState = {
    asideFolded: boolean;
    offScreen: boolean;
    headerVisible: boolean;
};
export declare type LayoutCommProps = LayoutState & {
    setLayout: ImmerSetter<LayoutState>;
};
//# sourceMappingURL=types.d.ts.map