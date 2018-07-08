import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import map from './map';

const FormItem = Form.Item;

function generator({ defaultProps, defaultRules }) {
  return (WrappedComponent) => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
      };
      render() {
        const { getFieldDecorator } = this.context.form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules, ...restProps } = this.props;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        return (
          <FormItem>
            {getFieldDecorator(defaultProps.name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach((item) => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
