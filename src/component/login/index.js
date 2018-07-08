import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import classNames from 'classnames';
import LoginItem from './loginItem';
import LoginSubmit from './loginSubmit';
import styles from './index.less';

@Form.create()
class Login extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static childContextTypes = {
    form: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    onSubmit: () => {},
  };

  getChildContext() {
    return {
      form: this.props.form,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.onSubmit(err, values);
    });
  }
  render() {
    const { className, children } = this.props;
    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit}>
          <div>{ children }</div>
        </Form>
      </div>
    );
  }
}

Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach((item) => {
  Login[item] = LoginItem[item];
});

export default Login;
