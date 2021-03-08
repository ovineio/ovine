/**
 *  TODO:
 * 1. 动态列
 * 2. 编辑/增加/删除
 * 3. 高级查询
 */
import { get, map, omit } from 'lodash'
import React, { useEffect } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'

import { emptyListHolder } from '~/app/constants'
import ScrollBar from '~/components/scroll_bar'

import apis from './apis'
import * as S from './styled'
import * as utils from './utils'

const getAdvanceQueryForm = () => {
  const advanceQueryForm = {
    type: 'form',
    title: '',
    mode: 'horizontal',
    horizontal: {
      leftFixed: true,
    },
    actions: [
      {
        label: '查看数据',
        type: 'button',
        actionType: 'dialog',
        dialog: {
          title: '数据',
          body: '<pre>${conditions|json:2}</pre>',
        },
      },
    ],
    controls: [
      {
        type: 'condition-builder',
        label: '条件组件',
        name: 'conditions',
        description: '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
        fields: [
          {
            label: '文本',
            type: 'text',
            name: 'text',
          },
          {
            label: '数字',
            type: 'number',
            name: 'number',
          },
          {
            label: '布尔',
            type: 'boolean',
            name: 'boolean',
          },
          {
            label: '选项',
            type: 'select',
            name: 'select',
            options: [
              {
                label: 'A',
                value: 'a',
              },
              {
                label: 'B',
                value: 'b',
              },
              {
                label: 'C',
                value: 'c',
              },
              {
                label: 'D',
                value: 'd',
              },
              {
                label: 'E',
                value: 'e',
              },
            ],
          },
          {
            label: '日期',
            children: [
              {
                label: '日期',
                type: 'date',
                name: 'date',
              },
              {
                label: '时间',
                type: 'time',
                name: 'time',
              },
              {
                label: '日期时间',
                type: 'datetime',
                name: 'datetime',
              },
            ],
          },
        ],
      },
    ],
  }

  return advanceQueryForm
}

const onPreReqModelData = (reqOpts) => {
  const { page, size, ...rest } = reqOpts.data

  reqOpts.data = {
    paging: { page, size },
    ...rest,
  }

  return reqOpts
}

const onReqSucModelData = (source, reqOpt) => {
  const { data: items, count: total } = source.data
  const { size } = reqOpt.data.paging

  source.data = {
    items,
    pageCount: Math.ceil(total / size),
    total,
  }

  return source
}

const onUpdatePreReq = (reqOpts) => {
  const fields = []
  const {ids} = reqOpts.data

  map(reqOpts.data, (value, id) => {
    if (/^\d+$/.test(id)) {
      fields.push({
        id,
        value,
      })
    }
  })

  reqOpts.data = ids ? { fields, ids } : { fields }

  return reqOpts
}

const getColumns = (tableInfo: any) => {
  const { fields = {} } = tableInfo

  const columns = map(omit(fields, ['id', 'addTime', 'updateTime']), (field: any) => {
    const { id: name, name: label } = field
    const column = {
      name,
      label,
      type: 'text',
    }

    return column
  })

  columns.unshift({
    name: 'id',
    label: 'ID',
    type: 'text',
  })

  return columns
}

const getUpdateForm = (type, tableInfo: any) => {
  const { fields = {}, detailDataApis } = tableInfo

  const controls: any = map(omit(fields, ['id', 'addTime', 'updateTime']), (field: any) => {
    const { id: name, name: label } = field
    const column = {
      name,
      label,
      type: 'text',
    }

    return column
  })

  if (type === 'batchEdit') {
    controls.unshift({
      type: 'hidden',
      name: 'ids',
    })
  }

  const schema = {
    type: 'form',
    api: detailDataApis[type],
    className: type,
    controls,
  }

  return schema
}

const getViewModel = () => {
  //
}

const getModelDataTable = (info) => {
  const { id, name } = info

  const detailDataApis = {
    list: {
      url: `POST ovhapi/model/api/model/${id}/list`,
      domain: 'modelApi',
      onPreRequest: onPreReqModelData,
      onSuccess: onReqSucModelData,
    },
    add: {
      url: `POST ovhapi/model/api/model/${id}`,
      domain: 'modelApi',
      onPreRequest: onUpdatePreReq,
    },
    edit: {
      url: `PUT ovhapi/model/api/model/${id}/$id`,
      domain: 'modelApi',
      onPreRequest: onUpdatePreReq,
    },
    del: {
      url: `DELETE ovhapi/model/api/model/${id}/$id`,
      domain: 'modelApi',
    },
    batchEdit: {
      url: `PUT ovhapi/model/api/model/${id}/batch`,
      domain: 'modelApi',
      onPreRequest: onUpdatePreReq,
    },
    batchDel: {
      url: `DELETE ovhapi/model/api/model/${id}/batch`,
      domain: 'modelApi',
      data: {
        ids: '$ids',
      },
    },
  }

  const modelCrud = {
    type: 'lib-crud',
    name: 'modelDataTable',
    syncLocation: false,
    api: detailDataApis.list,
    filterTogglable: false,
    perPageAvailable: [50, 100, 200],
    placeholder: emptyListHolder,
    defaultParams: {
      size: 50,
    },
    perPageField: 'size',
    pageField: 'page',
    headerToolbar: [
      {
        type: 'action',
        icon: 'fa fa-search pull-left',
        className: 'toolbar-divider',
        label: '高级查询',
        align: 'left',
        size: 'sm',
        actionType: 'drawer',
        drawer: {
          title: `【${name}】高级查询`,
          size: 'lg',
          body: getAdvanceQueryForm(),
        },
      },
      {
        type: 'action',
        icon: 'fa fa-plus pull-left',
        level: 'primary',
        label: '添加',
        size: 'sm',
        align: 'left',
        actionType: 'drawer',
        drawer: {
          title: `【${name}】添加一项`,
          size: 'lg',
          body: getUpdateForm('add', { ...info, detailDataApis }),
        },
      },
      {
        type: 'bulkActions',
        align: 'left',
      },
      {
        // limits: 'add',
        type: 'action',
        align: 'left',
        tooltip: '刷新数据',
        tooltipPlacement: 'top',
        icon: 'fa fa-refresh',
        size: 'sm',
        iconOnly: true,
        actionType: 'reload',
        target: 'modelDataTable',
      },
      {
        type: 'columns-toggler',
        align: 'left',
      },
      {
        type: 'export-excel',
        align: 'left',
      },
      {
        type: 'tpl',
        className: 'toolbar-divider',
        align: 'left',
        visibleOn: 'total',
        tpl: '$page/$pageCount 页, 共有 $total 项',
      },
      {
        type: 'pagination',
        align: 'left',
      },
      {
        type: 'switch-per-page',
        align: 'left',
      },
    ],
    footerToolbar: [],
    bulkActions: [
      {
        type: 'action',
        icon: 'fa fa-edit pull-left',
        label: '批量修改',
        align: 'left',
        actionType: 'drawer',
        drawer: {
          title: `【${name}】批量修改`,
          size: 'lg',
          data: {
            ids: '$ids',
          },
          body: getUpdateForm('batchEdit', { ...info, detailDataApis }),
        },
      },
      {
        type: 'action',
        icon: 'fa fa-remove text-danger pull-left',
        label: '批量删除',
        actionType: 'ajax',
        confirmText: '删除后将不可恢复，您确认要批量删除?',
        align: 'left',
        api: detailDataApis.batchDel,
      },
    ],
    itemActions: [
      {
        type: 'button',
        label: '查看',
        icon: 'fa fa-eye pull-left',
        actionType: 'dialog',
        dialog: {
          title: '查看',
          body: getViewModel(),
        },
      },
      {
        type: 'action',
        label: '编辑',
        icon: 'fa fa-edit pull-left',
        actionType: 'drawer',
        drawer: {
          position: 'right',
          size: 'lg',
          title: '编辑',
          body: getUpdateForm('edit', { ...info, detailDataApis }),
        },
      },
      {
        type: 'button',
        label: '删除',
        icon: 'fa fa-remove text-danger pull-left',
        actionType: 'ajax',
        confirmText: '删除后将不可恢复，您确认要删除?',
        api: detailDataApis.del,
      },
    ],
    columns: getColumns(info),
  }

  return modelCrud
}

const Nav = (props) => {
  const { cls, displayMode, tableList, activeId, setActiveId, setDisplayMode } = props

  const modeBtnStyle = (isActive) =>
    cls('Button', 'Button--default', 'Button--xs', { 'Button--primary is-active': isActive })

  const setActiveItem = (e) => {
    setActiveId(e.currentTarget.dataset.tid)
  }

  return (
    <div className="detail-nav border-right">
      <ScrollBar>
        <div className="detail-nav-hd border-bottom">
          <h6 className="m-b-none">模型导航</h6>
          <div className={cls('ButtonGroup')}>
            <button
              type="button"
              onClick={() => setDisplayMode('list')}
              className={modeBtnStyle(displayMode === 'list')}
            >
              <span>列表</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('form')}
              className={modeBtnStyle(displayMode === 'form')}
            >
              <span>表单</span>
            </button>
          </div>
        </div>
        <div className={cls('Nav', 'Nav--stacked')}>
          {tableList.map((item) => {
            const isActive = item.id === activeId
            return (
              <div
                className={`${isActive ? 'is-active' : ''} ${cls('Nav-item')}`}
                data-tid={item.id}
                onClick={setActiveItem}
              >
                <a> {item.name}</a>
              </div>
            )
          })}
        </div>
      </ScrollBar>
    </div>
  )
}

const Crud = (props) => {
  const { info = {} } = props

  const schema = {
    type: 'page',
    bodyClassName: 'p-none',
    body: getModelDataTable(info),
  }

  return (
    <div className="detail-crud">
      <Amis schema={schema} />
    </div>
  )
}

const ModeDetail = (props) => {
  const { classnames: cls } = props

  const [state, setState] = useImmer<any>({
    tableList: [],
    activeId: '',
    displayMode: 'list',
  })

  const { tableList, activeId, displayMode } = state
  const activeInfo = tableList.find((i) => `${i.id}` === activeId)

  const setActiveId = (id) => {
    setState((d) => {
      d.activeId = id
    })
  }

  const setDisplayMode = (mode) => {
    setState((d) => {
      d.displayMode = mode
    })
  }

  useEffect(() => {
    app
      .request({
        ...apis.listTable,
        onSuccess: utils.onGetTableListSuc,
      })
      .then((source) => {
        const { items = [] } = source.data.data
        setState((d) => {
          d.tableList = items
          d.activeId = get(items, '0.id') || ''
        })
      })
  }, [])

  const navProps = {
    displayMode,
    tableList,
    activeId,
    cls,
    setActiveId,
    setDisplayMode,
  }

  return (
    <S.ModelDetail>
      <Nav {...navProps} />
      <Crud cls={cls} info={activeInfo} displayMode={displayMode} />
    </S.ModelDetail>
  )
}

export const modelDetailSchema = {
  type: 'container',
  body: {
    component: ModeDetail,
  },
}
