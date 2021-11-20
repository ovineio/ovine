/**
 *  TODO:
 * 1. 两列布局
 * 1. 可自定义 展示/编辑 内容
 */
import { Button } from 'amis'
import { uuid } from 'amis/lib/utils/helper'
import { get, map, omit, find } from 'lodash'
import React, { useEffect, useRef } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'

import { emptyListHolder } from '~/app/constants'
import saveFile from '~/assets/savefile'
import PopOver from '~/components/popover'
import ScrollBar from '~/components/scroll_bar'

import apis from './apis'
import * as S from './styled'
import * as utils from './utils'

const getColumns = (tableInfo: any) => {
  const { fields = [], isSearchMode = false, isViewMode = false } = tableInfo

  let items = fields

  if (isSearchMode) {
    items = items.filter((item) => get(item, 'meta.searchable'))
  }

  const columns = map(items, (field: any) => {
    const { id: name, type = 'text', name: label, ...rest } = field
    const editType = get(rest, 'editStyle.type') || 'text'
    let column: any = {}
    let searchInfo: any = {}

    switch (editType) {
      case 'url':
        column = {
          type: 'tpl',
          tpl: `
          <% if (data[${name}]) {%>
              <a class="text-truncate d-inline-block" title="<%= data[${name}] %>" 
                style="${
                  isViewMode ? '' : 'width:150px;'
                }" target="_blank" href="<%= data[${name}] %>"><%= data[${name}] %></a>
          <%} else {%>
            -
          <%}%>`,
        }
        break
      case 'file':
        column = {
          isViewMode,
          type: 'container',
          body: {
            component: (props) => {
              const fileUrl = props.data[name] || ''
              return !fileUrl ? (
                '-'
              ) : (
                <S.FileItem>
                  {isViewMode && <span className="m-r-md">{fileUrl}</span>}
                  <span className="file-actions">
                    <i
                      className="fa fa-copy"
                      data-tooltip="复制链接"
                      onClick={() => props.env.copy(fileUrl)}
                    />
                    <i
                      className="fa fa-download m-l-sm"
                      data-tooltip="下载文件"
                      onClick={() => saveFile(fileUrl, `${label}-${uuid()}`)}
                    />
                  </span>
                </S.FileItem>
              )
            },
          },
        }
        break
      case 'image':
        column = {
          type: 'image',
          className: 'table-cell-image',
          thumbMode: 'cover',
          enlargeAble: true,
        }
        break
      case 'switch':
        column = {
          type: 'mapping',
          isViewMode,
          map: {
            '0': '<span class=\'label bg-secondary\'>否</span>',
            '1': '<span class=\'label label-info\'>是</span>',
          },
        }
        searchInfo.type = 'boolean'
        break
      case 'checkboxes':
        column = {
          name,
          type: 'each',
          isViewMode,
          items: {
            type: 'tpl',
            tpl: '<span class=\'label label-default m-l-sm\'><%= data.item %></span> ',
          },
        }
        searchInfo = {
          type: 'select',
          searchable: true,
          options: rest.editStyle.options,
        }
        break
      case 'date':
      case 'datetime':
      case 'time':
        searchInfo.type = editType
        break
      case 'month':
      case 'year':
        searchInfo.type = 'date'
        break
      case 'number':
        searchInfo.type = 'number'
        break
      default:
    }

    column = {
      name,
      label,
      type,
      fieldExtra: {
        ...rest,
        searchInfo,
      },
      toggled: true,
      sortable: get(rest, 'meta.sortable'),
      ...column,
    }

    return column
  })

  const dateTimeField = {
    toggled: false,
    sortable: true,
    // searchable: true,
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
      sortable: true,
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
  const columns = getColumns({
    ...info,
    isSearchMode: true,
  })

  const fields = columns.map((field) => {
    const { name, label, fieldExtra = {} } = field

    const filedInfo: any = {
      name,
      label,
      type: 'text',
      ...fieldExtra.searchInfo,
    }

    return filedInfo
  })
  // let formRef: any = {}
  const advanceQueryForm = {
    type: 'form',
    title: '',
    mode: 'normal',
    // horizontal: { left: 'col-sm-2', right: 'col-sm-10' },
    target: 'modelDataTable',
    // onInit: (...args: any[]) => {
    //   formRef = args[1]
    // },
    controls: [
      {
        type: 'group',
        controls: [
          getSearchLogSchema('select', {
            ...info,
            props: {
              label: '查询列表',
              mode: 'inline',
              className: 'm-b-sm',
            },
          }),
          {
            type: 'container',
            body: {
              type: 'action',
              actionType: 'clear',
              icon: 'fa fa-remove pull-left text-error',
              label: '清空条件',
              disabledOn: 'data.searchLog',
              onClick: () => {
                //
              },
              // onAction: (...args: any[]) => {
              //   // formRef.store.setInited({})
              //   formRef.store.setValueByName('searchLog', '')
              //   // const names = ['searchLog', 'label1', 'label2', 'conditions']
              //   // names.forEach((name) => {

              //   // })
              // },
            },
          },
        ],
      },
      {
        type: 'hidden',
        name: 'id',
      },
      {
        type: 'group',
        mode: 'inline',
        controls: [
          {
            type: 'text',
            name: 'label1',
            inputClassName: 'w-md',
            label: '查询名称',
            placeholder: '请输入查询名称',
          },
          {
            type: 'text',
            mode: 'normal',
            name: 'label2',
            placeholder: '请输入查询描述',
          },
        ],
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
  const { page = 1, size = 50, orderDir, orderBy, op, ...rest } = reqOpts.data

  reqOpts.data = {
    paging:
      op === 'export-csv'
        ? {
            page: 1,
            size: 10000,
          }
        : { page, size },
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
      required: type === 'batchEdit' ? false : editStyle.required,
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
  const columns = getColumns({
    ...info,
    isViewMode: true,
  })

  const controls = columns.map((item) => {
    const { type, isViewMode } = item
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

    const staticTypes = ['container']

    return {
      ...item,
      type: isViewMode ? type : viewType,
      inputClassName: staticTypes.includes(type) ? `${app.theme.getName()}-Form-static` : '',
    }
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
  const doAdvanceQuery = () => {
    options.tableRef.current.getComponentByName('curd.advanceQueryDrawer').tryChildrenToHandle({
      actionType: 'submit',
    })
  }

  const doCrudQuery = (query) => {
    options.tableRef.current.getComponentByName('curd.modelDataTable').handleQuery(query, true)
  }

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
          options: source.data.data.map((item) => {
            return {
              id: item.id,
              label1: item.label1,
              label2: item.label2,
              stored: item.value,
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
      onSuccess: (source) => {
        doAdvanceQuery()
        return source
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
        const { conditions } = reqOpts.data
        reqOpts.data.id = reqOpts.data.searchLog
        if (conditions) {
          reqOpts.data.value = JSON.stringify({ conditions })
        }
        return reqOpts
      },
      onSuccess: (source) => {
        doAdvanceQuery()
        return source
      },
    },
    del: {
      url: 'DELETE ovhapi/fontstored/$id',
      domain: 'modelApi',
    },
  }

  if (type === 'update') {
    return {
      type: 'action',
      label: '更新条件',
      visibleOn: '!!data.searchLog',
      actionType: 'ajax',
      api: logApis.edit,
    }
  }

  if (type === 'add') {
    return {
      type: 'action',
      label: '保存条件',
      visibleOn: '!data.searchLog',
      actionType: 'ajax',
      api: logApis.add,
    }
  }

  const selectControl = {
    type: 'select',
    name: 'searchLog',
    placeholder: '选择查询条件',
    className: 'm-none',
    inputClassName: 'w-md',
    searchable: true,
    removable: true,
    clearable: true,
    labelField: 'label1',
    valueField: 'id',
    source: logApis.list,
    deleteApi: logApis.del,
    menuTpl: {
      type: 'container',
      body: {
        component: (props) => {
          const { label1, label2, onClick = () => {} } = props.data
          return (
            <div onClick={onClick}>
              <span className="font-weight-bold">{label1}</span>
              <span className="p-l-sm text-black-50">{label2}</span>
            </div>
          )
        },
      },
    },
    onChange: (selectId, _, itemIns, formIns) => {
      if (!selectId) {
        return
      }
      const item = find(itemIns.options.toJSON(), { id: selectId })
      const formData = { ...omit(item, ['stored']), ...JSON.parse(item.stored) }

      if (type === 'select') {
        formIns.setValues(formData)
      } else if (type === 'search') {
        formData.searchLog = selectId
        doCrudQuery(omit(formData, ['id', 'value']))
        options.close()
      }
    },
    ...options.props,
  }

  if (type === 'search') {
    const fromSchema = {
      type: 'form',
      className: 'p-sm',
      wrapWithPanel: false,
      autoFocus: true,
      mode: 'inline',
      controls: selectControl,
      onSubmit: () => {
        // options.close()
      },
    }
    return fromSchema
  }

  if (type === 'select') {
    return selectControl
  }
}

const getModelDataTable = (info) => {
  const { id, name, tableRef } = info

  const doCrudQuery = (query) => {
    const crudIns = tableRef.current.getComponentByName('curd.modelDataTable')
    crudIns.props.store.updateQuery(query, undefined, 'page', 'size', true)
    crudIns.search(undefined, undefined, undefined, undefined, true)
  }

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

  const columns = getColumns(info)

  const modelCrud = {
    columns,
    type: 'lib-crud',
    name: 'modelDataTable',
    // alwaysShowPagination: true,
    syncLocation: false,
    api: detailDataApis.list,
    filterTogglable: false,
    perPageAvailable: [50, 100, 200],
    placeholder: emptyListHolder,
    defaultParams: {
      size: 50,
    },
    // checkOnItemClick: true,
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
        className: 'btn-open-query-drawer',
        reload: 'none',
        align: 'left',
        size: 'sm',
        actionType: 'drawer',
        drawer: {
          title: `【${name}】高级查询`,
          size: 'lg',
          name: 'advanceQueryDrawer',
          actions: [
            {
              type: 'action',
              label: '立即查询',
              level: 'primary',
              className: 'btn-advance-query',
              actionType: 'submit',
            },
            getSearchLogSchema('update', info),
            getSearchLogSchema('add', info),
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
                  <Amis schema={getSearchLogSchema('search', { ...popProps, id, tableRef })} />
                )}
              >
                <Button
                  iconOnly
                  tooltipPlacement="top"
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
        type: 'export-csv',
        align: 'left',
      },
      {
        type: 'container',
        align: 'left',
        className: 'toolbar-divider',
        body: {
          component: (props) => (
            <QueryItem {...props} doCrudQuery={doCrudQuery} columns={columns} />
          ),
        },
      },
      {
        type: 'tpl',
        align: 'left',
        tpl: `<% if(data.pageCount) {%> 
            第 <%= data.page/data.pageCount %> 页, 共有 <%= data.total || 0%> 项
          <%} else { %>
            <span class="text-black-50">列表暂无数据</span>
          <%}%>`,
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

  // 列表/表单 切换功能
  return (
    <div className="detail-nav border-right">
      <ScrollBar>
        <div className="detail-nav-hd border-bottom">
          <h6 className="m-b-none">模型导航</h6>
          <div className={cls('ButtonGroup', 'd-none')}>
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
                key={item.id}
                className={`${isActive ? 'is-active' : ''} ${cls('Nav-item text-truncate')}`}
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

const QueryItem = (props: any) => {
  const { store, columns, doCrudQuery } = props
  const { query = {} } = store

  // const getQueryInfo = () => {
  //   if (tableRef.current) {
  //     console.log('@==>.tableRef', tableRef)
  //   }
  // }

  const filed = columns.find((i) => i.name === query.orderBy)
  const isAsc = query.orderDir === 'asc'

  const clearSort = () => {
    doCrudQuery(omit(query, ['orderBy', 'orderDir']))
  }

  const sortList = () => {
    doCrudQuery({
      ...query,
      orderDir: isAsc ? 'desc' : 'asc',
    })
  }

  const clearQuery = () => {
    const newQuery = omit(query, ['label1', 'label2', 'searchLog', 'id', 'value', 'conditions'])
    doCrudQuery(newQuery)
  }

  const openQuery = () => {
    $('.btn-open-query-drawer').trigger('click')
  }

  return (
    <S.QueryItem>
      {query.conditions && (
        <div>
          <span>查询:</span>
          <span
            className="cursor-pointer"
            data-tooltip="编辑查询"
            data-position="bottom"
            onClick={openQuery}
          >
            {query.label1 || '未命名查询'}
          </span>
          <i
            data-tooltip="取消查询"
            data-position="bottom"
            className="iconfont icon-close"
            onClick={clearQuery}
          />
        </div>
      )}
      {query.orderBy && (
        <div>
          <span>{get(filed, 'label')}:</span>
          <span
            className="cursor-pointer"
            data-tooltip={isAsc ? '切换为降序' : '切换为降序'}
            data-position="bottom"
            onClick={sortList}
          >
            {isAsc ? '升序' : '降序'}
          </span>
          <i
            data-tooltip="取消排序"
            data-position="bottom"
            className="iconfont icon-close"
            onClick={clearSort}
          />
        </div>
      )}
    </S.QueryItem>
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
      {activeId && <Crud key={activeId} cls={cls} info={activeInfo} displayMode={displayMode} />}
    </S.ModelDetail>
  )
}

export const modelDetailSchema = {
  type: 'container',
  body: {
    component: ModeDetail,
  },
}
