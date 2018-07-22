import * as React from 'react';
import PropTypes from 'prop-types';
import { omit, set, cloneDeep } from 'lodash';
import { TableRequstOptions } from '../../service/api';
import { ModalProps }  from '../modal/modal';
import { ButtonClickArgs } from '../actionButton';
import Wrapper, { WrapperProps } from '../wrapper';

import BaseButton, { BaseButtonClickProps } from './baseButton';
import { ComfirmModalProps, TableLoadType, BaseButtonClickArgs, FormMdalConfig } from '.';

export interface TableButtonProps extends BaseButtonClickProps, WrapperProps {
  actionkey: string;
  api?: string;
  modal?: ComfirmModalProps;
  formkey?: string;
  form?: ModalProps;
  requestOptions?: TableRequstOptions;
  tableLoadType?: TableLoadType;
}

export default class TableButton extends React.PureComponent<TableButtonProps> {
  static contextTypes = {
    config: PropTypes.object,
  };

  getFormProps = (): ModalProps | undefined => {
    const { form = {}, formkey, source } = this.props;
    const formConfig = this.context.config.form;
    const formConfigProps: FormMdalConfig = formkey && formConfig[formkey] || { };
    const { extends: ext = '', item, omitItems, setItemMap, ...restFormConfig } = formConfigProps;
    const extConfig = formConfig[ext] || {};

    let formProps: ModalProps = cloneDeep({
      ...extConfig,
      ...restFormConfig,
      ...form,
      item: {
        ...extConfig.item,
        ...item
      },
      itemSource: source
    });

    if (setItemMap) {
      Object.keys(setItemMap).forEach(key => set(formProps.item, key, setItemMap[key]));
    }

    if (omitItems) {
      formProps.item = omit(formProps.item, omitItems);
    }

    return formProps;
  }

  // 表单按钮执行 操作
  onFormBtnClick = (args: BaseButtonClickArgs) => {
    const { requestOptions, tableLoadType, source = {} } = this.props;

    const formProps = this.getFormProps();

    if (typeof formProps === 'undefined') {
      return;
    }

    if (!requestOptions) {
      return args.showFormModal(formProps);
    }

    const { tableRequest, loadTableByType  } = args;

    formProps.okButton = {
      click: (okArgs: ButtonClickArgs = {}) => {
        const { values = {} } = okArgs;
        requestOptions.data =  {
          ...requestOptions.data,
          ...source,
          ...values,
        };
        return tableRequest(requestOptions);
      },
    };

    if (typeof tableLoadType !== 'undefined') {
      formProps.okButton.afterClick = () => loadTableByType(tableLoadType);
    }

    args.showFormModal(formProps);
  }

  // 提示框 按钮 操作
  onModalBtnClick = (args: BaseButtonClickArgs) => {
    const { modal, requestOptions, tableLoadType, source = {} } = this.props;
    if (modal) {
      const { showComfirmModal, tableRequest, loadTableByType, values } = args;
      modal.modalProps.onOk = async () => {
        if (requestOptions) {
          requestOptions.data = { // 自动合并 values 请求参数
            ...requestOptions.data,
            ...source,
            ...values,
          };
          requestOptions.successHandler = () => {
            if (typeof tableLoadType !== 'undefined') {
              loadTableByType(tableLoadType);
            }
          };
          await tableRequest(requestOptions);
        }
      };
      showComfirmModal(modal);
    }
  }

  // 请求api按钮 操作
  click = async (args?: BaseButtonClickArgs) => {
    if (!args) {
      return;
    }

    const { loadTableByType, tableRequest, values } = args;
    const { modal, form, requestOptions, tableLoadType, formkey, click } = this.props;

    if (click) {
      return await click({ ...args, requestOptions });
    }

    if (modal) {
      return this.onModalBtnClick(args);
    } else if (form || formkey) {
      return this.onFormBtnClick(args);
    }

    if (requestOptions) { // 请求数据
      requestOptions.data = { // 自动合并 values   请求参数
        ...requestOptions.data,
        ...values,
      };
      return await tableRequest(requestOptions);
    }

    if (typeof tableLoadType !== 'undefined') { // 刷新表格
      loadTableByType(tableLoadType);
    }
  }

  render () {
    const {  beforeRender, render, afterRender, click, ...restProps } = this.props;

    return (
      <Wrapper {...this.props}>
        <BaseButton {...restProps} click={this.click} />
      </Wrapper>
    );
  }
}
