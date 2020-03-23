import "./includes";
import { AppInstance } from '@rtadmin/core/app/instance';
import { AppRequest } from "./request";
import { AppTheme } from "./theme";
import { AppConfig } from "./types";
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
declare const app: AppInstance & App;
export { app, AppRequest, AppTheme };
//# sourceMappingURL=index.d.ts.map