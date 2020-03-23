export declare function getBabelConfig(siteDir: string): {
    presets: string[];
    plugins: (string | (string | {
        libraryName: any;
        libraryDirectory: string;
        camel2DashComponentName: boolean;
    })[] | (string | {
        styledComponents: any;
    })[])[];
    extends?: undefined;
} | {
    presets: string[];
    plugins: (string | (string | {
        libraryName: any;
        libraryDirectory: string;
        camel2DashComponentName: boolean;
    })[] | (string | {
        styledComponents: any;
    })[])[];
    extends: string;
};
export declare function getDllBabelConfig(siteDir: string): {
    compact: boolean;
    plugins: string[];
    extends?: undefined;
} | {
    compact: boolean;
    plugins: string[];
    extends: string;
};
//# sourceMappingURL=babel.d.ts.map