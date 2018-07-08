import { routerRedux } from 'dva/router';
import { notification } from 'antd';

import STATUS_MSG from '../constant/statusMsg';
import CODE_MSG from '../constant/codeMsg';
import { logout } from '../util/user';
import { getStore } from '../index';

import { RequestOptions } from './request';

export function requsetError(error: any = {}, requestOptions: RequestOptions) {
  console.info('error->', error);
  const { dispatch } = getStore();
  const status = error.status;

  if (status === 401) {
    return logout();

  } else if (status === 403) {
    return dispatch(routerRedux.push('/exception/403'));

  } else if (status <= 504 && status >= 500) {
    return dispatch(routerRedux.push('/exception/500'));

  } else if (status >= 404 && status < 422) {
    notification.error({
      message: '请求错误',
      description: `请求接口 ${error.url} 不存在`
    });
    return;
  }

  const { disableCommonSuccessHandler, errorHandler } = requestOptions;

  if (!disableCommonSuccessHandler) {
    const errortext = STATUS_MSG[error.status] || error.statusText;
    notification.error({
      message: `服务器错误 ${status}: ${error.url}`,
      description: errortext,
    });
  }

  if (errorHandler) {
    errorHandler(error, requestOptions);
  }
}

export function codeError(source: any = {}, requestOptions: RequestOptions) {
  const { code, msg } = source;
  const { codeErrorTipMsgMap, disableCommonErrorHandler } = requestOptions;

  if (disableCommonErrorHandler) {
    return source;
  }

  const errorTipMap: any = { ...CODE_MSG, ...codeErrorTipMsgMap };
  const errorMsg: string = errorTipMap[code] || msg;

  if (code === 30405) {
    logout();
    notification.info({
      message: '提示',
      description: '登陆超时请重新的登陆账号',
    });
    return;
  }
  notification.error({
    message: '请求错误',
    description: errorMsg,
  });

  return source;
}
