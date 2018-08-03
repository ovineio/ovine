import * as React from 'react';
import { Form } from 'antd';
import { parse } from 'qs';
import { map, isEmpty, omitBy, isEqual, cloneDeep, pick } from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';

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
  load: TableButtonProps;
  location: Location;
  filterKey: string;
  filter?: FilterConfig;
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
  private form: WrappedFormUtils | undefined;

  componentWillMount() {
    this.setHashQuery(this.props.location.hash);
    this.newProps = this.getProps();
  }

  componentWillReceiveProps(nexprops: FilterPorps) {
    const { location, tableParams, filterKey } = this.props;

    if (filterKey !== nexprops.filterKey && this.form) {
      return this.setFormFileds(true);
    }

    if (location.hash !== nexprops.location.hash) {
      this.setHashQuery(nexprops.location.hash);
    }

    this.buttonKey = nexprops.tableLoadType ? unqid() : '';

    if (location.pathname !== nexprops.location.pathname) {
      this.newProps = this.getProps();
    }

    if (!isEqual(tableParams, nexprops.tableParams)) {
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
    // console.info('hashQuery->', this.hashQuery);

    this.hashQuery = data;
  }

  onFilter = (btnArgs: BaseButtonClickArgs) => {
    const { tableParams, load, tableLoadType } = this.props;
    const { values = {}, form } = btnArgs;
    this.form = form;

    const {
        api: loadApiKey = 'list',
        data: requestParams = {},
        ...restOptions
    } = load.requestOptions || {};

    const { api: apiList } = getRouteMenuData();
    let source: any = Object.assign({}, values);

    if (tableLoadType === TableLoadType.REFRESH) {
      source = this.setFormFileds(true);
      source.page = 1;
      this.hashQuery = false;
    }

    let data = Object.assign({}, tableParams, requestParams, source);

    if (!this.buttonKey) {
      data.page = 1;
      this.hashQuery = false;
    }

    if (this.hashQuery) {
      data = this.hashQuery;
      this.setFormFileds(false, data);
    }

    const result = {
      data: omitBy(data, i => i === undefined || i === ''),
      api: apiList[loadApiKey],
      ...restOptions,
    };

    loadTableData(result);
  }

  getInitValue = (): any => {
    const initValue: any = {};
    const { filter } = this.props;
    if (filter && filter.item) {
      map(filter.item, (options, key: string) => {
        initValue[key] = options.defaultValue;
      });
    }
    return initValue;
  }

  setFormFileds = (isRest: boolean, data?: any): any => {
    const form = this.form;
    const d = isRest ? this.getInitValue() : data;
    if (form) {
      form.setFieldsValue(pick(d, Object.keys(form.getFieldsValue())));
    }
    return d;
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
