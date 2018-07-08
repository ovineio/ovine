import store from 'store';
import { StoreKey } from '../constant/storeKey';
import { getter } from './misc';

export function setUserInfo(data) {
  return store.set(StoreKey.USER_INFO, data);
}

export function getUserInfo(field) {
  return getter(store.get(StoreKey.USER_INFO), field);
}

export function getAuthority(field) {
  return getter(store.get(StoreKey.AUTHORITY), field);
}

export function setAuthority(data) {
  return store.set(StoreKey.AUTHORITY, data);
}

export function setFlatedMenuData(data) {
  return store.set(StoreKey.ROUTE_DATA, data);
}
