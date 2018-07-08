import React, { PureComponent } from 'react';
import { Input, InputNumber } from 'antd';

class Text extends PureComponent {
  render() {
    const {
      label,
      placeholder,
      isNumber = false,
      isTextarea = false,
      ...restProps
    } = this.props;

    restProps.placeholder = placeholder || `输入${label}`;

    if (isNumber) {
      return <InputNumber {...restProps} />;
    }

    if (isTextarea) {
      return <Input.TextArea {...restProps} />;
    }

    return <Input {...restProps} />;
  }
}

export default Text;
