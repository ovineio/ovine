import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import { ButtonProps } from 'antd/lib/button';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';

export type BottonType = 'button' | 'text' | 'link';

export interface ButtonClickArgs {
  source?: any; // 按钮元数据， 表单数据 合并
  values?: any; // beforeClick 返回的数据, 默认与 source相同
  form?: WrappedFormUtils; // form集合
}

export interface BaseActionButtonProps {
  source?: any; // 按钮数据源
  text?: string; // 是否显示按钮
  isShow?: boolean; // 是否校验from表单
  isCheckForm?: boolean; // 按钮文本
  buttonType?: BottonType; // 按钮类型
  isAutoClick?: boolean; // 是否自动点击
  tooltip?: TooltipProps; // 是否有提示信息
  buttonProps?: ButtonProps; // 按钮组件参数
}

export interface ActionButtonProps extends BaseActionButtonProps {
  beforeClick?: (args?: ButtonClickArgs) => any | void; // 执行默认 click 操作 之前的操作
  click?: (args?: ButtonClickArgs) => any | void; // 默认按钮点击事件
  afterClick?: (args?: ButtonClickArgs) => void; // 按钮点击之后的操作
}

export interface ActionButtonContext {
  form: WrappedFormUtils;
}

export default class ActionButton extends React.Component<ActionButtonProps, {}> {
  static defaultProps = {
    text: '',
    isShow: true,
    isCheckForm: true,
    buttonType: 'button',
    isAutoClick: false,
  };

  static contextTypes = {
    form: PropTypes.object,
  };

  componentDidMount() {
    if (this.props.isAutoClick) {
      // 自动执行
      this.click();
    }
  }

  onFormClick = () => { // 存在 form 表单 按钮点击
    const context: ActionButtonContext = this.context;
    const { form } = context;

    const { beforeClick, afterClick, click, source: btnSource } = this.props;
    form.validateFields(async (err: any, formSource: any) => {
      if (err) {
        return;
      }

      let values;
      let source = { ...btnSource, ...formSource };

      if (typeof beforeClick === 'function') {
        values = await beforeClick({ source });
      }

      if (values === false) { // beforeClick 返回 false 则不执行后续操作
        return;
      }

      if (typeof click === 'function') {
        values = values === undefined ? source : values;
        values = await click({ source, values, form });
      }

      if (typeof afterClick === 'function') {
        values = values === undefined ? source : values;
        await afterClick({ source, values, form });
      }
    });
  }

  click = async () => { // 普通按钮点击
    if (this.context.form && this.props.isCheckForm) {
      return this.onFormClick();
    }

    const { beforeClick, afterClick, click, source = {} } = this.props;

    let values;

    if (typeof beforeClick === 'function') {
      values = await beforeClick({ source });
    }

    if (values === false) { // befrore click 返回 false 表示不执行后面代码
      return;
    }

    if (typeof click === 'function') {
      values = values === undefined ? source : values;
      values = await click({ source, values });
    }

    if (typeof afterClick === 'function') {
      values = values === undefined ? source : values;
      await afterClick({ source, values });
    }
  }

  renderButton() {
    const { buttonType, text, buttonProps } = this.props;

    switch (buttonType) {
      case 'text':
        return (
          <span {...buttonProps} onClick={this.click}>
            {text}
          </span>
        );
      case 'link':
        return (
          <a href="javascript:;" onClick={this.click}>
            {text}
          </a>
        );
      default:
        return (
          <Button {...buttonProps} onClick={this.click}>
            {text}
          </Button>
        );
    }
  }

  render() {
    const { isShow, tooltip } = this.props;

    if (!isShow) {
      return null;
    }

    // 添加提示信息
    if (get(tooltip, 'title')) {
      return <Tooltip {...tooltip}>{this.renderButton()}</Tooltip>;
    }

    return this.renderButton();
  }
}
