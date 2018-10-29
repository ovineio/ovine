export type Many<T> = T | T[];
export type Extend<T, U> = U & T;
export type UrlOptions = {
  method: 'get';
  module?: 'api';
  json?: boolean;
};

export function isUrl(path: string): boolean;
export function getUrl(api: string, params?: { [key: string]: any }, options?: UrlOptions): string;
export function unqid(len?: number, radix?: number): string;
export function formatNumDec(num: number, length?: number, fix?: number): number;
export function formatNum(num: number, length?: number, formater?: string): string;
export function numFixed(num: number, fix?: number): number;
export function getter<T extends object, U extends keyof T>(
  object: T,
  ...props: Array<Many<U>>
): Pick<T, U>;

export function loadFile(fileUrl: string): Promise<any>;
export function loadFiles(urls: string[]): Promise<any>;
