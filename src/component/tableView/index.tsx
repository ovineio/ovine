import * as React from 'react';
export * from './type';

import { connect } from 'dva';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { map, omit, isEqual, orderBy, findKey } from 'lodash';
import { Table as AntdTable } from 'antd';
import { SorterResult, SortOrder, ColumnProps } from 'antd/lib/table';
import { TableViewModelState } from '../../model/tableview';
import { getDisplayItem } from '../displayItem';

import ButtonList, { getButtonList, getAuthButtonList } from './buttonList';
import renderInfo from './info';
import getColmun from './column';
import Filter from './filter';
import { loadTableByType } from './utils';
import { TableLoadType, PageSizeOptions, TableConfig } from './type';
import ToolBar from './toolBar';

import { TableParmas } from './type';
import { TableButtonProps } from './tableButton';

import styles from './index.less';

export interface TableProps {
  tableview?: TableViewModelState;
  loading?: boolean;
  className?: string;
  location?: Location;
}

export interface TableState {
  tableLoadType: TableLoadType;
  tableParams: TableParmas;
  scroll: {
    x: number | boolean;
    y: number;
  };
  sort: {
    field: string;
    order: SortOrder;
  };
}

type TableContextProps = {
  config: TableConfig;
};

const showTotal = (total: number, range: number[]) => {
  return (
    <div>
      <ToolBar />
      <span>当前展示{range[0]}-{range[1]}条数据，共{total}条 </span>
    </div>
  );
};

const pagination = {
  pageSizeOptions: ['50', '100', '200'],
  size: 'small',
  defaultCurrent: 1,
  defaultPageSize: PageSizeOptions.one,
  hideOnSinglePage: false,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal,
};

@connect((args: any) => {
  const  { tableview, loading, routing } = args;
  return {
    tableview,
    location: routing.location,
    loading: loading.effects['tableview/loadTable'],
  };
})
export default class Table extends React.PureComponent<TableProps, TableState> {
  static defaultProps = {
    className: '',
  };

  static contextTypes: TableContextProps = {
    config: PropTypes.object,
  };

  state = {
    tableLoadType: TableLoadType.NULL,
    tableParams: {
      page: 1,
      size: PageSizeOptions.one,
    },
    scroll: {
      x: false,
      y: 400,
    },
    sort: {
      field: '',
      order: 'descend' as SortOrder
    }
  };

  private columns: ColumnProps<any>[] = [];
  private dataSource: any[] = [];

  componentDidMount() {
    this.setTableOffset();
    this.setTableProps();
  }

  componentWillReceiveProps(nextProps: Required<TableProps>) {
    const { tableLoadType, listSource } = nextProps.tableview;

    const { tableview, location } = this.props as Required<TableProps>;

    if (tableLoadType) { // 根据刷新类型 刷新表格数据
      this.setState({ tableLoadType });
      loadTableByType(TableLoadType.NULL);
      return;
    } else {
      this.setState({ tableLoadType: TableLoadType.NULL });
    }

    const hash = nextProps.location.hash;
    if (hash && location.hash !== hash) { // hash修改 刷新表格
      this.setState({ tableLoadType: TableLoadType.INIT });
      return;
    }

    if (!isEqual(tableview, nextProps.tableview)) { // 表格数据修改 重新获取 列数据
      this.dataSource = this.getDataSource(listSource, this.context.config.column);
      return;
    }

  }

  setTableOffset = () => {
    const $antTableBody: HTMLDivElement | null = document.querySelector('.ant-table-body');
    const $tableFilter: HTMLDivElement | null = document.querySelector('.tableview-filter');
    if (!$antTableBody) {
      return;
    }
    const filterHeight =  $tableFilter ?  $tableFilter.offsetHeight : -10;
    const tableHeight = window.innerHeight - 64 - 10 - 70 - filterHeight - 38 - 56 - 15;

    this.setState({
      scroll: {
        x: false,
        y: tableHeight,
      },
    });
  }

  setTableProps = () => {
    const { column, actionList } = this.context.config;
    this.columns = getColmun({ column, actionList });

    // 设置默认排序
    const sortKey = findKey(column, (i: ColumnProps<any>) => !!i.defaultSortOrder);
    if (sortKey) {
      this.setState({
        sort: {
          field: sortKey,
          order: column[sortKey].defaultSortOrder
        }
      });
    }
  }

  onTableChange = (tablePagination: any, _filters: any, sorter: SorterResult<any>) => {
    const { tableview } = this.props as Required<TableProps>;
    const { pageSize, current } = tablePagination;
    const { field, order } = sorter;
    const page: PageSizeOptions = tableview.pagination.pageSize !== pageSize ? 1 : current;

    this.setState({
      tableLoadType: TableLoadType.LOAD,
      tableParams: {
        size: pageSize,
        page,
      },
      sort: {
        field,
        order,
      },
    });
  }

  onTableRow = () => {
    const handler = this.context.config.column.handler;
    if (!handler || !handler.list) {
      return;
    }
    const { list } = handler;
    const authedActions: false | Array<TableButtonProps>
      = getAuthButtonList(getButtonList(list, this.context.config.actionList));

    if (!authedActions) {
      return;
    }

    return (
      <ButtonList
        buttonList={authedActions}
      />
    );
  }

  getDataSource = (listSource: any[], column: Pick<TableConfig, 'column'>): any[] => {
    if (!listSource.length) {
      return [];
    }

    const { sort: { field, order = '' } } = this.state;

    if (field) {
      listSource = orderBy(listSource, [field], [order.replace('end', '')]);
    }

    return listSource.map((item: any) => {
      const temp: any = {
        _uuid: item._uuid,
        _source: item, // 记录元数据
      };
      map(omit(column, 'handler'), (columnConfig, key) => {
        const { componentType, componentProps = {} } = columnConfig;
        // 获取组件数据
        temp[key] = getDisplayItem(componentType, Object.assign(componentProps, {
          value: item[key],
        }));
      });

      return temp;
    });
  }

  render() {

    const { props, state, columns, dataSource, context, onTableChange } = this;
    const { className = '', loading, tableview, location } = props as Required<TableProps>;
    const { tableLoadType, tableParams, scroll } = state;
    const { filter, actionList, info } = context.config;

    Object.assign(pagination, tableview.pagination);

    return (
      <div className={classNames(className, styles.tableWrapper)}>
        <Filter
          filterKey={tableview.fitlerKey}
          tableLoadType={tableLoadType}
          tableParams={tableParams}
          filter={filter}
          location={location}
          load={actionList.load}
        />
        {info && renderInfo()}
        <AntdTable
          bordered
          size="small"
          rowKey="_uuid"
          className={styles.table}
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          scroll={scroll}
          pagination={pagination} // 这里存在性能问题
          onChange={onTableChange}
        />
      </div>
    );
  }
}
