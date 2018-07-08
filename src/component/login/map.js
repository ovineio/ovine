import React from 'react';
import { Input, Icon } from 'antd';
import { getUrl } from '../../util/misc';

import styles from './index.less';

const getAuthCodeImgUrl = () => `${getUrl('authcode')}?v=${Date.now()}`;

const map = {
  UserName: {
    component: Input,
    props: {
      name: 'name',
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '请输入账户名',
    },
    rules: [{
      required: true, message: '请输入账户名',
    }],
  },
  Password: {
    component: Input,
    props: {
      name: 'password',
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '请输入密码',
    },
    rules: [{
      required: true, message: '请输入密码',
    }],
  },
  AuthCode: {
    component: Input,
    props: {
      name: 'auth_code',
      size: 'large',
      prefix: <Icon type="check-circle-o" className={styles.prefixIcon} />,
      placeholder: '请输入验证码',
      addonAfter: <img
        id="auth-code-img"
        className={styles.authcodeImg}
        src={getAuthCodeImgUrl()}
        alt="验证码"
        onClick={(e) => {
          e.target.src = getAuthCodeImgUrl();
        }}
      />,
    },
    rules: [{
      required: true, message: '请输入验证码',
    }],
  },
};

export default map;
