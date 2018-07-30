/**
 * set auth page
 */

import * as React from 'react';
import { map, values, flattenDepth, indexOf, uniq, get } from 'lodash';
import { Tree, Tabs, Button } from 'antd';
import classNames from 'classnames';

import request from '../../../service/request';
import { formaterMenuData, flatedMenuData } from '../../../route/menu';
import { unqid } from '../../../util/misc';

import styles from './index.less';

export interface LimitConfProps {
  history: any;
}

interface LimitConfStates {
  isExpandAll: boolean;
}

export default class LimitConf extends React.PureComponent<LimitConfProps, LimitConfStates> {

  state = {
    isExpandAll: true,
  };

  private apiMapKeys: { [key: string]: string[][] } = {};
  private checkedMapKeys: { [key: string]: string[] } = {};

  toggleExpandAll = (toggle: boolean) => {
    this.setState({ isExpandAll: toggle });
  }

  saveLimitKeys = () => {
    const modules = flattenDepth(values(this.checkedMapKeys));
    const menus = flattenDepth(values(this.apiMapKeys), 2).filter((i: any) => i);

    map(this.checkedMapKeys, (v: string[], k: string) => {
      if (v.length) {
        modules.push(k);
      }
    });

    const { requestOptions, source } = this.props.history.location.state;
    requestOptions.data = {
      _id: source._id,
      menus: uniq(menus),
      modules,
    };
    request(requestOptions);
  }

  onCheck = (key: string, e: any) => {
    this.checkedMapKeys[key] = e.halfCheckedKeys.concat(`${key}/_`, e.checkedNodes.map((i: any) => i.key));
    this.apiMapKeys[key] = e.checkedNodes.map((i: any) => i.props['data-api']).filter((i: string ) => i);
  }

  getSubTree = (item: any = {}) => {
    const { children, name, path = unqid() } = item;
    const { limit = undefined } = flatedMenuData[path] || {};
    if (limit) {
      return (
        <Tree.TreeNode className="tree-limit-panel" key={path} title={name} >
          {
            map(limit, (action: any = {}, actionKey: string) => {
              if (actionKey === 'list') {
                return null;
              }

              const { name: actionName = '', api = [] } = action;
              const nodeApi = api.concat(get(limit, 'list.api'));
              const nodeKey = `${path}/${actionKey}`;
              const mapKey = `/${path.split('/')[1]}`;

              if (this.checkedMapKeys[mapKey].find((i: string) => i === nodeKey)) {
                this.apiMapKeys[mapKey] = this.apiMapKeys[mapKey].concat(nodeApi);
              }

              return (
                <Tree.TreeNode data-api={nodeApi} key={nodeKey} title={actionName} />
              );
            })}
        </Tree.TreeNode>
      );
    }

    if (children && children.some((child: any) => child.name)) {
      return (
        <Tree.TreeNode key={path} title={name} >
          {this.getNavTree(children)}
        </Tree.TreeNode>
      );
    }

    // 无limit配置时默认
    return (
      <Tree.TreeNode key={path} title={name} />
    );
  }

  getNavTree = (menu: any) => {
    if (!menu) {
      return [];
    }
    return menu.filter((item: any) => item.name).map((item: any) => this.getSubTree(item));
  }

  render() {
    const { isExpandAll } = this.state;
    const {
      name = '', remark = '', _id = '', modules = []
    } = this.props.history.location.state.source || {};

    return (
      <div className={classNames('limits-config-page', styles.limitsConfigPage)} >
        <div className={classNames('fix', styles.actionPanel)}>
          <div className="user-info">
            <span>ID:</span> {_id || '--'}
            <span>角色名:</span> {name || '--'}
            <span>备注:</span> {remark || '--'}
          </div>
          <p className="action-list">
            <Button onClick={() => this.toggleExpandAll(!isExpandAll)}>
              {isExpandAll ? '收缩' : '展开'}全部
            </Button>
            <Button onClick={this.saveLimitKeys}>保存</Button>
            <Button onClick={this.props.history.goBack}>返回</Button>
          </p>
        </div>
        <Tabs animated={false} >
        {
          formaterMenuData.filter((item: any) => item.name && !item.isHide && item.children)
            .map((item: any) => {
              const { name: itemName = '', children = [], path = unqid() } = item || {};
              const defCheckedKeys = modules.filter((i: string) => (path !== i && i.indexOf(path) > -1));
              const defkeys = defCheckedKeys.slice(indexOf(defCheckedKeys, `${path}/_`) + 1, defCheckedKeys.length);
              this.checkedMapKeys[path] = defCheckedKeys;
              this.apiMapKeys[path] = [];
              return (
                <Tabs.TabPane key={path} tab={itemName} >
                  {children.length &&
                    <Tree
                      checkable
                      key={String(isExpandAll)}
                      selectable={false}
                      defaultExpandAll={isExpandAll}
                      onCheck={(...args: any[]) => this.onCheck(path, args[1])}
                      defaultCheckedKeys={defkeys}
                    >
                      {this.getNavTree(children)}
                    </Tree>
                  }
                </Tabs.TabPane>
              );
          })
        }
        </Tabs>
      </div>
    );
  }
}
