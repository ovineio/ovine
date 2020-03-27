import "./includes";
import { AppInstance } from '@rtadmin/core/lib/app/instance';
import { getPageFileAsync } from "../routes/exports";
import * as Types from "../utils/types";
import { AppRequest } from "./request";
import { AppTheme } from "./theme";
import { AppConfig, AppDefInstance } from "./types";
declare class AppProxy {
    constructor();
}
declare class App extends AppProxy {
    private isEnvSetUp;
    private isEntrySetUp;
    private registers;
    create(config: Types.DeepPartial<AppConfig>): void;
    register<K extends keyof AppInstance, V extends AppInstance[K]>(key: K, value: (() => V) | V): void;
    private setEntry;
    private dispatchRegisters;
    private setEnv;
    private setRequest;
}
declare const app: AppInstance & Omit<AppDefInstance, keyof AppInstance> & App;
export { app, AppRequest, getPageFileAsync, AppTheme };
