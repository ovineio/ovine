import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { get, findIndex } from 'lodash';
import { unqid } from '../util/misc';
import { tableRequst, dispLoadResource } from '../service/api';
import { TableLoadType, PageSizeOptions } from '../component/tableView';

import { Effect } from 'dva';
import { Reducer } from 'redux';

export type TableViewModelState = {
  tableLoadType: TableLoadType; // table加载类型
  listSource: any[]; // table 数据源
  storeSource: any; // 其他 数据源
  pagination: { // 页脚数据
    total: number; // 总条数
    current: number; // 当前页
    pageSize: PageSizeOptions // 每页条数
  };
  fitlerKey: string; // 刷新filter
};

export type TableViewModal = {
  namespace: 'tableview';
  state: TableViewModelState;
  effects: {
    loadTable: Effect; // 请求列表数据
    loadTableByType: Effect; // 更加不同加载类型刷新表格数据
    actionRequest: Effect; // 除了加载表格外请求
  };
  reducers: {
    saveLoadType: Reducer<any>; // 保存加载类型
    saveListSource: Reducer<any>; // 保存表格数据
    saveActionSource: Reducer<any>; // 保存其他请求数据
    resetFilter: Reducer<any>; // 保存其他请求数据
  };
};

const tableViewModel: TableViewModal = {
  namespace: 'tableview',
  state: {
    tableLoadType: TableLoadType.NULL,
    listSource: [], // list展示数据
    storeSource: {}, // 除list数据外所有请求数据暂存
    pagination: {
      // 页码所有数据
      total: 0,
      current: 1,
      pageSize: 50,
    },
    fitlerKey: '',
  },

  effects: {
    * loadTable({ payload }, { call, put }) {
      // 带条件加载列表，不加条件表示初始化列表，
      yield put(routerRedux.replace({
        pathname: location.pathname, // 将筛选条件同步到location中
        hash: stringify(get(payload, 'data')),
      }));
      const source = yield call(tableRequst, {
        getTableSource: dispLoadResource,
        ...payload,
      });

      yield put({
        type: 'saveListSource',
        payload: source,
      });
    },
    * loadTableByType({ payload }, { put }) {
      yield put({
        type: 'saveLoadType',
        payload,
      });
    },
    * actionRequest({ payload }, { call, put }) {
      // 任何数据处理操作
      const { updateSyncType, ...restArgs } = payload;
      const { source } = yield call(tableRequst, restArgs);

      const actionSource: any = { source, updateSyncType };

      if (updateSyncType) {
        actionSource.args = restArgs.data;
      }

      yield put({
        type: 'saveActionSource',
        payload: actionSource,
      });
    },
  },

  reducers: {
    saveLoadType(state, { payload }) {
      return {
        ...state,
        tableLoadType: payload,
      };
    },
    saveListSource(state, { payload = {} }) {
      const { pagination = {}, list = [] } = payload;
      return {
        ...state,
        pagination,
        listSource: list,
        storeSource: {},
      };
    },
    saveActionSource(state, { payload }) {
      let { listSource, pagination } = state;
      const { updateSyncType, args = {}, source = {} } = payload;
      const { _uuid, _id, id } = args;

      const uid: any = _uuid ? { _uuid } : _id ? { _id } : id ? { id } : null;
      if (updateSyncType && uid) { // 同步参数数据到 数据源
        const index = findIndex(listSource, uid);
        const uKey = Object.keys(uid)[0];
        switch (updateSyncType) {
          case 'edit':
            listSource[index] = {
              ...listSource[index],
              ...args,
            };
            break;
          case 'del':
            listSource = listSource.filter((i: any) => i[uKey] !== uid[uKey]);
            --pagination.total;
            break;
          default:
        }
      }

      return {
        ...state,
        listSource,
        pagination,
        storeSource: source,
      };
    },
    resetFilter(state) {
      return {
        ...state,
        fitlerKey: unqid(),
      };
    }
  },
};

export default tableViewModel;
