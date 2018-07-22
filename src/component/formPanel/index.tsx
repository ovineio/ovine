import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { map, difference, pick, isEqual } from 'lodash';

import { Form, Row } from 'antd';
import { FormProps } from 'antd/lib/form';
import { WrappedFormUtils, FormCreateOption } from 'antd/lib/form/Form';

import FormItem, { FormItemOptionProps, FormItemProps } from './formItem';
import styles from './index.less';

export type FormItemType = {
  [key: string]: FormItemOptionProps;
};

export interface FormPanelOptionProps extends FormProps {
  onChange?: (args?: any) => any;
  isModalForm?: boolean;
  children?: any;
  itemKeys?: string[]; // form 表单排序数组
}
export interface FormPanelProps extends FormPanelOptionProps {
  item: FormItemType;
  itemSource?: any;
}

export interface FormPanelState {
  item: FormItemType;
}

export interface FormPanelContext {
  form: WrappedFormUtils;
}

class FormPanel extends React.Component<FormPanelProps, FormPanelState> {

  static defaultProps = {
    className: '',
    layout: 'inline',
    isModalForm: false,
  };

  static childContextTypes = {
    form: PropTypes.object,
  };

  state = {
    item: this.props.item,
  };

  getChildContext() {
    return {
      form: this.props.form,
    };
  }

  componentWillReceiveProps(nextProps: FormPanelProps) {
    if (!isEqual(this.props.item, nextProps.item)) {
      this.setState({ item: nextProps.item });
    }
  }

  toggleItems = (keys: string[], toggle: boolean) => {
    const { item } = this.props;
    if (toggle) {
      this.setState({
        item: {
          ...this.state.item,
          ...pick(item, keys),
        }
      });
      return;
    }

    this.setState({
      item: !keys.length ? item : pick(item, difference(Object.keys(item), keys))
    });
  }

  renderFormItems = (): Array<React.ReactNode> => {
    const { isModalForm, onChange, itemSource = {}, itemKeys = [] } = this.props;
    const { item } = this.state;
    const that = this;
    const items: Array<React.ReactNode> = [];
    // console.info('itemKeys->', itemKeys);

    if (itemKeys.length) {
      itemKeys.forEach(key => addItem(key, item[key]));
    } else {
      map(item, (val, key) => addItem(key, val));
    }

    function addItem(key: string, props: FormItemOptionProps) {
      if (!props) {
        return;
      }
      const formProps: FormItemProps = {
        isModalFormItem: isModalForm,
        onFormChage: onChange,
        toggleItems: that.toggleItems,
        defaultValue: itemSource[props.name || key],
        name: key,
        ...props,
      };
      items.push(<FormItem key={key} {...formProps} />);
    }

    return items;
  }

  render() {
    const { className, children, style, layout } = this.props;

    return (
      <div
        className={classNames(`${className} formpanel`, styles.formPanel)}
        style={style}
      >
        <Form layout={layout} >
          <Row className="item-wrapper">
            {this.renderFormItems()}
            {children}
          </Row>
        </Form>
      </div>
    );
  }
}

const create: (option?: any) => any = Form.create;
const formOption: FormCreateOption<FormPanelProps> = {
  onFieldsChange(props: FormPanelProps, changedFields: any) {
    if (props.onChange) {
      props.onChange(changedFields);
    }
  },
  // mapPropsToFields(props) {
  //   return {
  //     username: Form.createFormField({
  //       ...props.username,
  //       value: props.username.value,
  //     }),
  //   };
  // },
  // onValuesChange(props, values) {
  //   console.log(values);
  // },
};

export default create(formOption)(FormPanel);
