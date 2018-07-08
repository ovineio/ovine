import * as React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Checkbox, Alert } from 'antd';

import CODE_MSG from '../../constant/codeMsg';
import Login from '../../component/login';

import styles from './login.less';
import { Extend } from '../../util/misc';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { UserModelState } from '../../model/user';

const { UserName, Password, Submit } = Login; // AuthCode

type StoreData = {
  user: UserModelState;
  submitting: boolean;
};

type LoginPageProps = Extend<StoreData, {
  dispatch: (arg: any) => any;
}>;

type LoginPageState = {
  autoLogin: boolean;
};

@connect(({ user, loading }: any): StoreData => ({
  user,
  submitting: loading.effects['user/login'],
}))

export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  state = {
    autoLogin: true,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'user/isLogin',
    });
  }

  componentWillReceiveProps(nexporps: LoginPageProps) {
    if (!this.props.user.isLogin && nexporps.user.isLogin) {
      this.props.dispatch(routerRedux.push('/'));
    }
  }

  handleSubmit = (err: any, values: any) => {
    // this.refreshAuthCode();

    if (err) {
      return;
    }

    this.props.dispatch({
      type: 'user/login',
      payload: {
        disableCommonErrorHandler: true,
        data: {
          ...values,
        },
      },
    });
  }

  changeAutoLogin = (e: CheckboxChangeEvent): void => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  refreshAuthCode = (): void => {
    (window.document.getElementById('auth-code-img') as HTMLImageElement).click();
  }

  renderMessage = (content: string): JSX.Element => {
    // this.refreshAuthCode();
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  }

  render() {
    const { user, submitting } = this.props;
    const errMsg = user.loginCode ? CODE_MSG[user.loginCode] : '';
    // <AuthCode />
    return (
      <div className={styles.main}>
        <Login onSubmit={this.handleSubmit}>
          {errMsg && !submitting && this.renderMessage(errMsg)}
          <UserName />
          <Password />
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              记住账号
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
