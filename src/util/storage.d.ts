import { UserInfo } from './user';
import { Many } from './misc';
import { FlatedMenuData, FlatedMenuConfig } from '../route/menu';

export function setAuthority(data: object): void;
export function getAuthority(field?: string | string[]): object;

export function setUserInfo(data: UserInfo): void;
export function getUserInfo<T extends UserInfo, U extends keyof T>(): T;
export function getUserInfo<T extends UserInfo, U extends keyof T>(field?: U[] | U): T[U];
