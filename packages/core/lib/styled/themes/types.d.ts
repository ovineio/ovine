export interface AppThemeVariable {
    ns: string;
    name: string;
    text: string;
    colors: {
        echart: string[];
        bodyBg: string;
        text: string;
        layoutHeaderBg: string;
        linkHover: string;
        border: string;
    };
}
