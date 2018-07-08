
import noImage from '../asset/image/no-pic-80.png';

export type CrudType = 'list' | 'add' | 'edit' | 'del';

export const ACTION_DEF_NAME: { [curdType: string]: string } = {
  list: '查看',
  add: '添加',
  edit: '编辑',
  del: '删除',
};

export const TABLEVIEW_PAGE_SIZE_OPTS: number[] = [50, 100, 200];

export const HEADER_WIDTH: { [componentType: string]: number } = {
  'Date': 110,
  'Date.Day': 100,
  'Date.Month': 100,
  'Date.Time': 50,
  'Image': 50,
  'Status.YesNo': 50,
};

export const HEADER_NONE: { [componentType: string]: any } = {
  'Number': '0',
  'Number.Ratio': '0%',
  'Number.Int': '0',
  'Number.Float': '0.00',
  'Image': noImage,
};
