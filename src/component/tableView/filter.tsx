import * as React from 'react';
import { Form } from 'antd';
import { parse } from 'qs';
import { map, isEmpty, omitBy, isEqual, cloneDeep } from 'lodash';

import { getRouteMenuData } from '../../route/menu';
import { unqid } from '../../util/misc';

import FormPanel, { FormItemType } from '../formPanel';
import Wrapper from '../wrapper';
import TableButton, { TableButtonProps } from './tableButton';
import { loadTableData } from './utils';
import { TableLoadType, FilterConfig, TableParmas, BaseButtonClickArgs } from './index';

const style = {
  marginBottom: '10px',
};

export interface FilterPorps {
  tableParams: TableParmas;
  tableLoadType: TableLoadType;
  filter?: FilterConfig;
  load: TableButtonProps;
  location: Location;
}

declare interface FilterStates {
  hashQuery: any;
}

export default class Filter extends React.PureComponent<FilterPorps, FilterStates> {
  static defaultProps = {
    load: {},
  };

  private buttonKey: string = 'filter';
  private hashQuery: any = false;
  private newProps: any = {};

  componentWillMount() {
    this.setHashQuery(this.props.location.hash);
    this.newProps = this.getProps();
  }

  componentWillReceiveProps(nexprops: FilterPorps) {
    if (this.props.location.hash !== nexprops.location.hash) {
      this.setHashQuery(nexprops.location.hash);
    }
    this.buttonKey = nexprops.tableLoadType ? unqid() : '';

    if (this.props.location.pathname !== nexprops.location.pathname) {
      this.newProps = this.getProps();
    }

    if (!isEqual(this.props.tableParams, nexprops.tableParams)) {
      this.hashQuery = false;
    }
  }

  setHashQuery = (hash: string) => {
    const { load } = this.props;
    if (!hash) {
      this.hashQuery = false;
      return;
    }

    const query = parse(hash.substr(1, hash.length - 1));
    let data = load.requestOptions ? load.requestOptions.data : {};
    data = {
      ...data,
      ...query,
    };
    this.hashQuery = data;
  }

  onFilter = (btnArgs: BaseButtonClickArgs) => {
    const { tableParams, filter, load, tableLoadType } = this.props;
    const { values = {}, form } = btnArgs;
    const {
        api: loadApiKey = 'list',
        data: requestParams = {},
        ...restOptions
    } = load.requestOptions || {};

    const { api: apiList } = getRouteMenuData();
    let source: any = values;

    if (tableLoadType === TableLoadType.REFRESH) {
      if (form) {
        form.resetFields();
      }
      source = {};
      if (filter && filter.item) {
        map(filter.item, (options, key: string) => {
          source[key] = options.defaultValue;
        });
      }
    }

    let data = {
      ...tableParams,
      ...requestParams,
      ...source,
    };

    if (!this.buttonKey) {
      data.page = 1;
      this.hashQuery = false;
    }

    data = {
      ...data,
      ...this.hashQuery,
    };
    const result = {
      data: omitBy(data, i => i === undefined || i === ''),
      api: apiList[loadApiKey],
      ...restOptions,
    };

    loadTableData(result);
  }

  getFormItems = (item: FormItemType): FormItemType  => {
    map(this.hashQuery, (val: string, key: string) => {
      if (item[key]) {
        item[key].defaultValue = val;
      }
    });
    // this.hashQuery = false;
    return item;
  }

  getProps = (): any => {
    const  { filter } = this.props;

    const { item = undefined, ...restFilterProps } = filter || {};

    const result: any = {
      item: cloneDeep(item),
      isShow: !isEmpty(filter),
      ...restFilterProps,
    };

    result.click = this.onFilter;

    return result;
  }

  render() {
    const { item, isShow, ...restProps } = this.newProps;
    const isAutoClick = !!this.buttonKey;

    if (!isShow || !item) {
      return (
        <TableButton
          isShow={false}
          key={this.buttonKey}
          isAutoClick={isAutoClick}
          {...restProps}
        />
      );
    }

    const formItem = !this.hashQuery ? item : this.getFormItems(item);

    return (
      <Wrapper {...restProps}>
        <FormPanel
          style={style}
          item={formItem}
          className={'tableview-filter'}
        >
          <Form.Item>
            <TableButton
              isShow
              text="查询"
              key={this.buttonKey}
              isAutoClick={isAutoClick}
              {...restProps}
            />
          </Form.Item>
        </FormPanel>
      </Wrapper>
    );
  }
}
