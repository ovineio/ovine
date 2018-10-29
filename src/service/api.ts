import { unqid } from '../util/misc';
import request, { RequestOptions } from './request';

export interface TableRequstOptions extends RequestOptions {
  updateSyncType?: 'edit' | 'del'; // 更新 前端数据同步
  getTableSource?: (source: any, args: TableRequstOptions) => TableResource; /* 加载表格后 默认dispLoadResource处理 请求值  */
  getDataSrouce?: (source: any, args: TableRequstOptions) => any;
}

export interface TableResource {
  requestOptions: TableRequstOptions;
  list: Array<any>;
  pagination: {
    total: number;
    current: number;
    pageSize: number;
  };
}

export const dispLoadResource = (source: any = {}, options: TableRequstOptions): TableResource => {
  let { data, count, pageSize, page } = source;

  const pagination = {
    total: count,
    current: parseInt(page, 10),
    pageSize: parseInt(pageSize, 10),
  };
  if (!data) {
    data = [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  data = data.map((i: any) => ((i._uuid = unqid()), i)); // eslint-disable-line
  const result: TableResource = {
    requestOptions: options,
    list: data,
    pagination,
  };
  return result;
};

export const tableRequst = async function(options: TableRequstOptions) {
  const { getTableSource, getDataSrouce } = options;
  const source = await request(options);

  if (getTableSource) {
    return getTableSource(source, options);
  }

  if (getDataSrouce) {
    return getDataSrouce(source, options);
  }

  return {
    source,
    options,
  };
};
