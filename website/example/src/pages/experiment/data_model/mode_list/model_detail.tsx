/**
 *  TODO:
 * 1. 解析查询信息  列举查询/清除查询
 */
import { Button } from 'amis'
import { get, map, omit } from 'lodash'
import React, { useEffect, useRef } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'

import { emptyListHolder } from '~/app/constants'
import PopOver from '~/components/popover'
import ScrollBar from '~/components/scroll_bar'

import apis from './apis'
import * as S from './styled'
import * as utils from './utils'

const getViewTypeByInputType = (type: string) => {
  let viewType = 'static'
  switch (type) {
    case 'image':
      viewType = 'static-image'
      break
    case 'json':
      viewType = 'static-json'
      break
    default:
  }
  return viewType
}

const getColumns = (tableInfo: any) => {
  const { fields = {} } = tableInfo

  const columns = map(omit(fields, ['id', 'addTime', 'updateTime']), (field: any) => {
    const { id: name, type = 'text', name: label, ...rest } = field
    const column = {
      name,
      label,
      type,
      fieldExtra: rest,
      toggled: true,
      sortable: true,
      searchable: true,
      // searchable: {
      //   mode: 'horizontal',
      //   controls: [
      //     {
      //       label,
      //       type,
      //     },
      //   ],
      // },
    }

    return column
  })

  const dateTimeField = {
    toggled: false,
    sortable: true,
    searchable: true,
    fieldExtra: {
      editStyle: {
        type: 'datetime',
      },
    },
  }

  const tableColumns = [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      toggled: true,
    } as any,
  ].concat(columns, [
    {
      name: 'addTime',
      label: '添加时间',
      type: 'text',
      width: 160,
      toggled: false,
      ...dateTimeField,
    },
    {
      name: 'updateTime',
      label: '更新时间',
      width: 160,
      type: 'text',
      toggled: false,
      ...dateTimeField,
    },
  ])

  return tableColumns
}

const getAdvanceQueryForm = (info) => {
  const columns = getColumns(info)

  const fields = columns.map((field) => {
    const { name, label, fieldExtra = {} } = field
    const item: any = { name, label, type: 'text' }

    const { editStyle = {} } = fieldExtra

    switch (editStyle.type) {
      case 'number':
        item.type = 'number'
        break
      case 'time':
        item.type = 'time'
        break
      case 'month':
      case 'year':
        item.type = 'date'
        break
      case 'datetime':
        item.type = 'datetime'
        break
      default:
    }

    return item
  })

  const advanceQueryForm = {
    type: 'form',
    title: '',
    mode: 'normal',
    // horizontal: { left: 'col-sm-2', right: 'col-sm-10' },
    target: 'modelDataTable',
    controls: [
      {
        ...getSearchLogSchema('search'),
        label: '查询列表',
        mode: 'inline',
        className: 'm-b-sm',
      },
      {
        type: 'condition-builder',
        label: '查询条件组合',
        name: 'conditions',
        required: true,
        fields,
      },
    ],
  }

  return advanceQueryForm
}

const onPreReqModelData = (reqOpts) => {
  const { page, size, orderDir, orderBy, ...rest } = reqOpts.data

  reqOpts.data = {
    paging: { page, size },
    ...rest,
  }

  if (orderBy) {
    reqOpts.data.ordering = [
      {
        fieldId: orderBy,
        asc: orderDir === 'asc',
      },
    ]
  }

  return reqOpts
}

const onReqSucModelData = (source, reqOpt) => {
  const { data: items = [], count: total = 0 } = source.data || {}
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
  const { ids } = reqOpts.data

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

const getUpdateForm = (type, tableInfo: any) => {
  const { fields = {}, detailDataApis } = tableInfo
  const controls: any = map(omit(fields, ['id', 'addTime', 'updateTime']), (field: any) => {
    const { id: name, name: label, editStyle } = field
    const column = {
      name,
      label,
      type: 'text',
      ...editStyle,
    }

    return column
  })

  const schema = {
    type: 'form',
    api: detailDataApis[type],
    className: type,
    controls,
  }

  if (type === 'batchEdit') {
    schema.controls.unshift({
      type: 'hidden',
      name: 'ids',
    })
    return schema
  }

  return schema
}

const getViewModel = (info) => {
  const columns = getColumns(info)

  const controls = columns.map((item) => {
    const { type } = item
    item.type = getViewTypeByInputType(type)
    return item
  })

  const schema = {
    controls,
    type: 'form',
    mode: 'horizontal',
    wrapWithPanel: false,
    actions: [],
  }

  return schema
}

const getSearchLogSchema = (type: string, options: any = {}) => {
  const storeData = {
    parentKey: 'modelDetailData',
    key: `modelTableId_${options.id}`,
  }

  const logApis = {
    list: {
      url: 'GET ovhapi/fontstored',
      domain: 'modelApi',
      data: storeData,
      onSuccess: (source) => {
        source.data = {
          options: source.data.data.map((item, index) => {
            return {
              label1: item.label1,
              label2: item.label2,
              stored: item.value,
              value: index,
            }
          }),
        }
        return source
      },
    },
    add: {
      url: 'POST ovhapi/fontstored',
      domain: 'modelApi',
      data: {
        '&': '$$',
        value: '$conditions',
        ...storeData,
      },
      onPreRequest: (reqOpts) => {
        reqOpts.data.value = JSON.stringify({ conditions: reqOpts.data.value })
        return reqOpts
      },
    },
    edit: {
      url: 'PUT ovhapi/fontstored/$id',
      domain: 'modelApi',
      data: {
        '&': '$$',
        ...storeData,
      },
      onPreRequest: (reqOpts) => {
        // console.log('@--->', reqOpts)
        return reqOpts
      },
    },
    del: {
      url: 'DELETE ovhapi/fontstored/$id',
      domain: 'modelApi',
    },
  }

  const logFormSchema = {
    type: 'form',
    api: logApis.add,
    // onSubmit: (...args: any) => {
    // console.log('@===>', args)
    // },
    controls: [
      {
        type: 'text',
        name: 'label1',
        require: true,
        label: '查询名称',
      },
      {
        type: 'textarea',
        name: 'label2',
        label: '查询描述',
      },
    ],
  }

  if (type === 'add') {
    return logFormSchema
  }

  const selectControl = {
    type: 'select',
    name: 'select',
    placeholder: '选择查询条件',
    className: 'w-md m-none',
    searchable: true,
    editable: true,
    removable: true,
    source: logApis.list,
    editApi: logApis.edit,
    deleteApi: logApis.del,
    menuTpl: `
      <span style="font-weight:bold;">$label1</span>
      <span style="padding-left:10px; color:#666;">$label2</span>
    `,
    editControls: [
      {
        type: 'tpl',
        mode: 'normal',
        tpl:
          '<div class="text-sm m-b-md text-black-50">此处只能编辑查询的 名称/描述。如果要修改查询的内容，请删除该该项，重新使用高级查询添加。</div>',
      },
      ...logFormSchema.controls,
    ],
    submitOnChange: type !== 'search',
  }

  if (type === 'select') {
    const fromSchema = {
      type: 'form',
      className: 'p-sm',
      wrapWithPanel: false,
      autoFocus: true,
      onSubmit: () => {
        options.close()
      },
      controls: [selectControl],
    }
    return fromSchema
  }

  if (type === 'search') {
    return selectControl
  }
}

const getModelDataTable = (info) => {
  const { id, name, tableRef } = info

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
        icon: 'fa fa-plus pull-left',
        level: 'primary',
        label: '添加',
        className: 'toolbar-divider',
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
        type: 'action',
        icon: 'fa fa-search pull-left',
        label: '高级查询',
        reload: 'none',
        align: 'left',
        size: 'sm',
        actionType: 'drawer',
        drawer: {
          title: `【${name}】高级查询`,
          size: 'lg',
          actions: [
            {
              type: 'action',
              label: '立即查询',
              level: 'primary',

              actionType: 'submit',
            },
            {
              type: 'action',
              label: '保存条件',
              actionType: 'dialog',
              dialog: {
                title: '保存查询条件',
                body: getSearchLogSchema('add', { id }),
              },
            },
            {
              type: 'action',
              actionType: 'close',
              label: '取消',
            },
          ],
          body: getAdvanceQueryForm(info),
        },
      },
      {
        // limits: 'add',
        type: 'container',
        body: {
          component: (btnProps) => {
            return (
              <PopOver
                placement="bottom"
                Popup={(popProps) => (
                  <Amis schema={getSearchLogSchema('select', { ...popProps, id, tableRef })} />
                )}
              >
                <Button
                  iconOnly
                  placement="top"
                  tooltip="选择查询条件"
                  theme={btnProps.theme}
                  size="sm"
                >
                  <i className={btnProps.classnames('Button-icon fa fa-sliders')} />
                </Button>
              </PopOver>
            )
          },
        },
        align: 'left',
        tooltip: '筛选条件',
        className: 'search-select',
        tooltipPlacement: 'top',
        icon: 'fa fa-sliders',
        size: 'sm',
        iconOnly: true,
        onClick: () => {
          tableRef.current.getComponentByName('curd.modelDataTable').handleFilterReset()
        },
      },
      {
        // limits: 'add',
        type: 'button',
        align: 'left',
        tooltip: '清空筛选条件',
        tooltipPlacement: 'top',
        icon: 'fa fa-refresh',
        size: 'sm',
        iconOnly: true,
        onClick: () => {
          tableRef.current.getComponentByName('curd.modelDataTable').handleFilterReset()
        },
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
        visibleOn: 'data.total',
        tpl: '第 <%= data.page/data.pageCount %> 页, 共有 <%= data.total || 0%> 项',
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
        messages: {
          success: '删除成功',
          failed: '删除失败',
        },
      },
    ],
    itemActions: [
      {
        type: 'button',
        label: '查看',
        icon: 'fa fa-eye pull-left',
        actionType: 'drawer',
        drawer: {
          title: '查看信息',
          closeOnOutside: true,
          size: 'lg',
          actions: [],
          body: getViewModel(info),
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
          title: '编辑信息',
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
        messages: {
          success: '删除成功',
          failed: '删除失败',
        },
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
  const tableRef = useRef()
  const amisProps = {
    scopeRef: (ref) => {
      tableRef.current = ref
    },
  }

  const schema = {
    type: 'page',
    name: 'curd',
    bodyClassName: 'p-none',
    body: getModelDataTable({ ...info, tableRef }),
  }

  return (
    <div className="detail-crud">
      <Amis schema={schema} props={amisProps} />
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
      {activeId && <Crud cls={cls} info={activeInfo} displayMode={displayMode} />}
    </S.ModelDetail>
  )
}

export const modelDetailSchema = {
  type: 'container',
  body: {
    component: ModeDetail,
  },
}
