import * as React from 'react';
import classNames from 'classnames';
import { map } from 'lodash';
import { Modal as AntdModal } from 'antd';
import { ModalProps as AntdModalProps } from 'antd/lib/modal';

import FormPanel, { FormPanelProps } from '../formPanel';
import ActionButton, { ActionButtonProps } from '../actionButton';
import Wrapper, { WrapperProps } from '../wrapper';
import styles from './index.less';

export interface ModalProps extends AntdModalProps, ActionButtonProps, FormPanelProps, WrapperProps {
  title?: string;
  isModalForm?: boolean;
  showFooter?: boolean;
  okButton?: ModalButtonProps;
  cancelBtton?: ModalButtonProps;
  buttons?: { [key: string]: ModalButtonProps };
  footerClass?: string;
}

export interface ModalState {
  visible?: boolean;
}

export interface ModalButtonProps extends ActionButtonProps {
  isCloseModal?: boolean;
}

export type ModalFunc = (props: ModalProps) => {
  destroy: () => void;
};

export default class Modal extends React.PureComponent<ModalProps, ModalState> {
  static FormModal: (props: ModalProps) => React.ReactNode;
  static showFormModal: ModalFunc;
  static showModal: ModalFunc;

  static defaultProps = {
    isModalForm: false,
    showFooter: true,
    okButton: {
      text: '确定',
      isCloseModal: true,
    },
    cancelBtton: {
      text: '取消',
      isCheckForm: false,
      isCloseModal: true,
    },
    buttons: {},
  };

  state = {
    visible: true,
  };

  componentWillReceiveProps(nextProps: ModalProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  toggleModal = (toggle: boolean) => {
    this.setState({
      visible: !!toggle,
    });
  }

  renderButton = (props: ModalButtonProps, key: string) => {
    const _this = this;
    const beforeClick = async (...args: any[]) => {
      if (props.isCloseModal !== false) {
        _this.toggleModal(false);
      }
      if (typeof props.beforeClick === 'function') {
        const result = await props.beforeClick(args);
        return result;
      }
    };

    return <ActionButton key={key} {...props} beforeClick={beforeClick} />;
  }

  renderFooter = () => {
    const { okButton, cancelBtton, buttons, footerClass = '' } = this.props;

    if (!buttons) {
      return null;
    }

    if (okButton) {
      buttons.okButton = {
        ...Modal.defaultProps.okButton,
        ...okButton,
      };
    }

    if (cancelBtton) {
      buttons.cancelBtton = {
        ...Modal.defaultProps.okButton,
        ...cancelBtton,
      };
    }

    return (
      <div className={classNames(`${footerClass} ant-modal-footer`, styles.modalFooter)}>
        {map(buttons, (btn: ModalButtonProps, key: string) => this.renderButton(btn, key))}
      </div>
    );
  }

  render() {
    const { visible } = this.state;
    const {
      beforeRender, render, afterRender, showFooter,
      isModalForm, className = '',
      ...restProps
    } = this.props;

    return (
      <Wrapper {...this.props}>
        <AntdModal
          destroyOnClose
          footer={null}
          className={classNames(`${className} app-modal`, styles.modal)}
          {...restProps}
          visible={visible}
        >
          {this.props.children}
          { !isModalForm ? (showFooter && this.renderFooter()) :
              <FormPanel isModalForm {...restProps} >
                <div className={classNames(styles.moalFormFooter)}>
                  {showFooter && this.renderFooter()}
                </div>
              </FormPanel>
          }
        </AntdModal>
      </Wrapper>
    );
  }
}

Modal.FormModal = (props: ModalProps) => {
  return <Modal isModalForm {...props} />;
};
