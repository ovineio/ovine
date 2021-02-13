/**
 *  TODO:
 * 1. 动态列
 * 2. 编辑/增加/删除
 * 3. 高级查询
 */
import { get } from 'lodash'
import React, { useEffect } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'

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

const getUpdateForm = (type) => {
  const schema = {
    type: 'form',
    className: type,
    controls: [
      {
        type: 'static',
        name: 'engine',
        label: 'Engine',
      },
      {
        type: 'divider',
      },
      {
        type: 'static',
        name: 'browser',
        label: 'Browser',
      },
      {
        type: 'divider',
      },
      {
        type: 'static',
        name: 'platform',
        label: 'Platform(s)',
      },
      {
        type: 'divider',
      },
      {
        type: 'static',
        name: 'version',
        label: 'Engine version',
      },
      {
        type: 'divider',
      },
      {
        type: 'static',
        name: 'grade',
        label: 'CSS grade',
      },
      {
        type: 'divider',
      },
      {
        type: 'html',
        html: '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>',
      },
    ],
  }

  return schema
}

const getViewModel = () => {
  //
}

const getModelDataTable = (info) => {
  const { id, name } = info

  const modelCrud = {
    type: 'lib-crud',
    syncLocation: false,
    api: {
      url: `POST ovhapi/model/api/model/${id}/list`,
      domain: 'modelApi',
      onPreRequest: onPreReqModelData,
      onSuccess: onReqSucModelData,
    },
    filterTogglable: false,
    perPageAvailable: [50, 100, 200],
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
        align: 'left',
        actionType: 'drawer',
        drawer: {
          title: '【$name】高级查询',
          size: 'lg',
          body: getUpdateForm('add'),
        },
      },
      {
        type: 'bulkActions',
        align: 'left',
      },
      {
        limits: 'add',
        type: 'action',
        align: 'left',
        actionType: 'dialog',
        tooltip: '刷新数据',
        tooltipPlacement: 'top',
        icon: 'fa fa-refresh',
        iconOnly: true,
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
      },
      {
        type: 'action',
        icon: 'fa fa-remove text-danger pull-left',
        label: '批量删除',
        align: 'left',
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
          position: 'left',
          size: 'lg',
          title: '编辑',
          body: getUpdateForm('edit'),
        },
      },
      {
        type: 'button',
        label: '删除',
        icon: 'fa fa-remove text-danger pull-left',
        actionType: 'ajax',
        confirmText: '您确认要删除?',
        api: 'delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/$id',
      },
    ],
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        width: 80,
      },
      {
        name: 'desc',
        label: '描述',
        type: 'text',
      },
      {
        name: 'createTime',
        label: '创建时间',
        type: 'datetime',
        width: 150,
      },
      {
        name: 'updateTime',
        label: '更新时间',
        type: 'datetime',
        width: 150,
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

// export const modelDetailSchema = {
//   type: 'lib-css',
//   css: styled.modelDataListCss,
//   body: {
//     type: 'hbox',
//     columns: [
//       {
//         columnClassName: 'model-detail-nav',
//         type: 'lib-renderer',
//         renderer: 'sysScrollBar',
//         body: [
//           {
//             type: 'hbox',
//             className: 'p-sm mode-detail-nav-header',
//             columns: [
//               {
//                 type: 'html',
//                 html: '<h6 class="m-b-none d-inline-block">模型导航</h6>',
//               },
//               {
//                 columnClassName: 'text-right',
//                 type: 'form',
//                 mode: 'inline',
//                 target: 'page',
//                 wrapWithPanel: false,
//                 onInit: (_, formIns) => {
//                   formIns.store.setValueByName('detailMode', 'list')
//                 },
//                 controls: [
//                   {
//                     type: 'button-group',
//                     name: 'detailMode',
//                     submitOnChange: true,
//                     onChange: (mode: string) => {
//                       utils.displayModeCtrl('set', mode)
//                     },
//                     options: [
//                       {
//                         label: '列表',
//                         value: 'list',
//                         size: 'xs',
//                       },
//                       {
//                         label: '表单',
//                         value: 'form',
//                         size: 'xs',
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             type: 'service',
//             schemaApi: {
//               $preset: 'apis.listTable',
//               onSuccess: async (apisSource) => {
//                 const source = await utils.onGetTableListSuc(apisSource)
//                 const items = source.data.items

//                 if (!items.length) {
//                   source.data = {
//                     type: 'html',
//                     html: '无数据',
//                   }
//                 }

//                 source.data = {
//                   type: 'nav',
//                   stacked: true,
//                   onSelect: (link) => {
//                     const $nav = $('.model-detail-nav ')
//                     const page = utils.getScopRef().getComponentByName('page')
//                     page.context.send('modelDataCrud', { id: link.id })
//                     page.props.env.updateLocation(link.to)
//                     $nav.find('.is-active').removeClass('is-active')
//                     $nav.find(`.model-table-${link.id}`).addClass('is-active')

//                     return false
//                   },
//                   links: items.map(({ name, id }) => {
//                     return {
//                       label: name,
//                       id,
//                       className: `model-table-${id}`,
//                       to: '#table=' + id,
//                     }
//                   }),
//                 }

//                 return source
//               },
//             },
//           },
//         ],
//       },
//       {
//         type: 'service',
//         name: 'modelDataCrud',
//         className: 'model-crud-service',
//         schemaApi: {
//           url: 'GET fakeModelData?id=$id',
//           onFakeRequest: getModelDataTable,
//         },
//       },
//     ],
//   },
// }
