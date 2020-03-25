declare function importer(this: any, url: string, prev: string): false | {
    file: string;
    contents: string;
} | {
    file: string;
    contents?: undefined;
} | null;
export = importer;
