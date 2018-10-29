import { ColumnProps } from 'antd/lib/table/interface';
import { ModalFuncProps } from 'antd/lib/modal';
import { Path, LocationDescriptorObject, LocationState } from 'history';
import { TableRequstOptions } from '../../service/api';
import { ModalProps }  from '../modal/modal';
import { WrapperProps } from '../wrapper';
import { FormPanelOptionProps, FormItemType } from '../formPanel';
import { ButtonClickArgs, ActionButtonProps } from '../actionButton';
import { TableButtonProps } from './tableButton';
import { ButtonListProps } from './buttonList';

// 表格加载类型
export enum TableLoadType {
  NULL = '', // 不操作
  INIT = 'init', // 读取 location hash参数值 初始化 加载
  REFRESH = 'refresh', // 还原所有filter默认值值刷新
  LOAD = 'load', // 更加当前filter获取表格数据，同步filter参数到location
}

export enum PageSizeOptions {
  one = 50,
  two = 100,
  three = 200,
}

export type TableParmas = {
  page: number;
  size: PageSizeOptions;
};

export interface ComfirmModalProps {
  modalType: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
  modalProps: ModalFuncProps;
}

export interface BaseButtonClickArgs extends ButtonClickArgs {
  source?: any;
  requestOptions?: any;
  loadTableByType: (args: TableLoadType) => Promise<void>;
  tableRequest: (args: TableRequstOptions) => Promise<void>;
  showFormModal: (args: ModalProps) => void;
  showComfirmModal: (args: ComfirmModalProps) => void;
  linkTo(path: Path, state?: LocationState): void;
  linkTo(location: LocationDescriptorObject): void;
}

export interface FilterConfig extends ActionButtonProps, ModalProps {
}

export interface FormMdalConfig extends ActionButtonProps, FormPanelOptionProps {
  extends?: string;
  omitItems?: string[]; // 需要忽略的表单项配置
  setItemMap?: { [key: string]: any }; // 设置具体表单项配置
  item?: FormItemType;
}

export interface ColumnConfig<T> extends ColumnProps<T> {
  componentType: string;
  componentProps?: any;
  list?: ButtonListConfigType; // 仅 hanlder 时 可用
}

export type ButtonListConfigType = Array<string | TableButtonProps> | ButtonListProps;

export type ActionListConfigType = {
  load: TableButtonProps; // 必填
  [key: string]: TableButtonProps;
};

export type ColumnConfigType = {
  [key: string]: ColumnConfig<any>;
};

export type FormConfigType = {
  [key: string]: FormMdalConfig;
};

// 自动生成表格 完整 配置项
export interface BaseConfig {
  actionList: ActionListConfigType;
  column: ColumnConfigType;
  handler?: ButtonListConfigType;
  filter?: FilterConfig;
  form?: FormConfigType;
  info?: any;
}

export interface TableConfig extends BaseConfig { }
