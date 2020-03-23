import { Schema } from 'amis/lib/types';
import { LimitSchema, PagePreset } from "../../../routes/types";
export declare type SchemaPreset = PagePreset & {
    actions?: Types.ObjectOf<Schema>;
    forms?: Types.ObjectOf<Schema>;
};
export declare type RtSchema = Schema & LimitSchema & {
    preset?: SchemaPreset;
};
//# sourceMappingURL=types.d.ts.map