import fetch from 'dva/fetch';
import { trim, get } from 'lodash';
import { getUrl } from '../util/misc';
import { requsetError } from './errorHandler';
import successHandler from './succeseHandler';

export interface RequestOptions {
  api?: string;
  data?: { [key: string]: any };
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'; // GET
  headers?: { [key: string]: string };
  body?: any;
  credentials?: string; // include
  disableCommonErrorHandler?: true; // false
  disableCommonSuccessHandler?: true; // false
  codeErrorTipMsgMap?: { [key: string]: string }; // {}
  successTipMsg?: string; // "操作成功"
  successHandler?: (response: any, requestOptions: RequestOptions) => any; // null
  errorHandler?: (response: any, requestOptions: RequestOptions) => any; // null
}

export interface ResponseData {
  code?: number;
  data?: any;
  msg?: string;
}

export default function request<T>(options: RequestOptions): Promise<T> {
  const { api: requestApi = '', data } = options;
  const apiMethod: any = trim(get(trim(requestApi).match(/^.* /), 0)) || 'GET';
  const api: string = requestApi.replace(/^.* /, '');

  const newOptions: any = {
    credentials: 'include',
    method: apiMethod,
    ...options
  };

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(data);

    } else {// newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }

  const url = getUrl(api, data, newOptions);
  return fetch(url, newOptions)
    .then((response: any) => response.json())
    .then((source: ResponseData) => successHandler(source, newOptions))
    .catch((error: any) => requsetError(error, newOptions));
}
