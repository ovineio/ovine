import * as React from 'react';
import PropTypes from 'prop-types';
import { defaultsDeep, find, clone, get } from 'lodash';
import { Form, Col } from 'antd';
import { FormItemProps as AntdFormItemProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions, ValidationRule } from 'antd/lib/form/Form';
import { ColProps } from 'antd/lib/col';

import { FormPanelContext } from '.';
import getInputItem from '../inputItem';

const FormItem = Form.Item;

export interface FormItemOptionProps extends AntdFormItemProps {
  componentType: string;
  defaultValue?: any;
  value?: any;
  onChange?: (args?: any) => any;
  componentProps?: any;
  rules?: ValidationRule[];
  required?: boolean;
  isModalFormItem?: boolean;
  name?: string;
  layout?: {
    itemCol?: ColProps;
    labelCol?: ColProps;
    wrapperCol?: ColProps;
  };
}

export interface FormItemProps extends FormItemOptionProps {
  name: string;
  onFormChage?: (args?: any) => any;
  toggleItems: (keys: string[], toggle: boolean) => void;
}

export default class Item extends React.Component<FormItemProps> {
  static contextTypes = {
    form: PropTypes.object,
  };

  static defaultProps = {
    rules: [],
    layout: {},
    componentProps: {},
    required: false,
    isModalFormItem: false,
  };

  componentDidMount() {
    const { name, value, defaultValue, componentType } = this.props;
    if (typeof value !== 'undefined') {
      const context: FormPanelContext = this.context;
      context.form.setFieldsValue({ [name]: value });
    }
    if (componentType === 'Select' && defaultValue) {
      const { toggleItems, componentProps } = this.props;
      const hiddenKeys = get(componentProps, `options.${defaultValue}.hiddenKeys`);
      if (hiddenKeys) {
        toggleItems(hiddenKeys, false);
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.context.form;
    const { name, onChange, componentType, required,
      isModalFormItem, toggleItems, onFormChage, defaultValue,
      ...restProps
    } = this.props;

    const options: GetFieldDecoratorOptions = {
      initialValue: defaultValue,
    };

    const rules: ValidationRule[] = clone(this.props.rules) || [];
    if (required && !find(rules, { required: true })) {
      rules.push({
        required: true,
        message: '该项为必须填写',
      });
    }

    options.rules = rules;

    const componentProps: any = {
      label: restProps.label,
      ...this.props.componentProps,
    };

    if (onChange && !componentProps.onChange) {
      componentProps.onChange = onChange;
    }
    if (componentType === 'Select') {
      componentProps.toggleItems = toggleItems;
    }

    const FormItemComponet = getInputItem(componentType, componentProps);

    let { layout = {} } = this.props;
    if (isModalFormItem) { // 设置 ModalFormItem 的默认布局
      layout = defaultsDeep({}, layout, {
        itemCol: {
          span: 24,
        },
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 17,
        },
      });
    }

    const { itemCol } = layout;

    if (!itemCol) {
      return (
        <FormItem {...restProps} {...layout} >
          {getFieldDecorator(name, options)(FormItemComponet)}
        </FormItem>
      );
    }

    return (
      <Col {...itemCol} className="form-item-col">
        <FormItem {...restProps} {...layout} >
          {getFieldDecorator(name, options)(FormItemComponet)}
        </FormItem>
      </Col>
    );
  }
}
