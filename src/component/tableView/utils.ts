import { routerRedux } from 'dva/router';
import { Path, LocationDescriptorObject, LocationState } from 'history';
import { Modal as AntdModal } from 'antd';

import { TableRequstOptions } from '../../service/api';
import { getStore } from '../../index';
import Modal from '../modal';
import { ModalProps }  from '../modal/modal';
import { ComfirmModalProps, TableLoadType } from './type';

const store = getStore();

// 请求 api 获取 表格加载数据
export const loadTableData = async (options: TableRequstOptions): Promise<void> => {
  store.dispatch({
    type: 'tableview/loadTable',
    payload: options,
  });
};

// 根据 加载类型 加载table
export const loadTableByType = async (type: TableLoadType): Promise<void> => {
  store.dispatch({
    type: 'tableview/loadTableByType',
    payload: type,
  });
};

// 请求api
export const tableRequest = async (args: TableRequstOptions): Promise<void> => {
  store.dispatch({
    type: 'tableview/actionRequest',
    payload: args,
  });
};

// 重置 fitler 为默认值
export const resetFilter = (): void => {
  store.dispatch({ type: 'tableview/resetFilter' });
};

// 跳转页
export const linkTo = (location: LocationDescriptorObject | Path, state?: LocationState): void => {
  store.dispatch(routerRedux.push(location, state));
};

// 显示 form 表单
export const showFormModal = (props: ModalProps): void => {
  Modal.showFormModal(props);
};

// 显示提示框
export const showComfirmModal = (props: ComfirmModalProps): void => {
  const { modalType, modalProps } = props;
  AntdModal[modalType](modalProps);
};
