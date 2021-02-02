import Erd from './erd'
import * as styled from './styled'
import * as tpl from './template'
import * as utils from './utils'


export default {
  props: {
    scopeRef: utils.scopeRefProp,
  },
  schema: {
    type: 'page',
    name: 'page',
    title: '模型列表',
    remark: '数据模型可以用于在线生成API',
    bodyClassName: 'p-none',
    data: {
      displayMode: utils.displayModeCtrl('get'),
    },
    css: styled.modelListPageCss,
    cssVars: {
      '--Drawer-widthXl': '75%',
    },
    toolbar: [
      {
        $preset: 'forms.switchMode',
      },
      {
        $preset: 'actions.copyTable',
        disabledOn: 'displayMode === "diagram"',
      },
      {
        $preset: 'actions.add',
        disabledOn: 'displayMode === "diagram"',
      },
    ],
    body: [
      {
        visibleOn: 'displayMode === "list"',
        ...tpl.getModeList(),
      },
      {
        visibleOn: 'displayMode === "diagram"',
        type: 'container',
        body: {
          component: Erd,
        },
      },
    ],
    definitions: {
      fieldsTransfer: {
        name: 'types',
        type: 'transfer',
        selectMode: 'tree',
        selectTitle: '请选择字段',
        resultTitle: '已选择的字段',
        searchable: true,
        sortable: true,
        source: {
          $preset: 'apis.listTable',
          onSuccess: utils.onGetFieldOptsSuc,
        },
      },
    },
    preset: {
      actions: {
        add: {
          limits: 'add',
          type: 'button',
          align: 'right',
          actionType: 'dialog',
          label: '添加模型',
          icon: 'fa fa-plus pull-left',
          size: 'sm',
          primary: true,
          dialog: {
            title: '添加一个模型',
            size: 'md',
            bodyClassName: 'p-none',
            body: '$preset.forms.addTable',
          },
        },
        viewTableData: {
          label: '${name}',
          size: 'lg',
          level: 'link',
          type: 'action',
          actionType: 'drawer',
          drawer: {
            title: '【${name}】模型数据',
            size: 'xl',
            closeOnEsc: true,
            resizable: true,
            actions: [],
            data: {
              id: '$id',
              name: '$name',
              items: [],
            },
            body: tpl.getModelDataTable(),
          },
        },
        copyTable: {
          limits: 'add',
          type: 'button',
          align: 'right',
          actionType: 'dialog',
          label: '复制模型',
          icon: 'fa fa-copy pull-left',
          size: 'sm',
          dialog: {
            title: '添加一个模型',
            size: 'md',
            bodyClassName: 'p-none',
            body: '$preset.forms.addTable',
          },
        },
        editTable: {
          limits: 'edit',
          type: 'action',
          icon: 'fa fa-pencil pull-left',
          label: '编辑',
          actionType: 'dialog',
          dialog: {
            title: '编辑模型【$name】',
            size: 'lg',
            actions: [],
            bodyClassName: 'p-none',
            onClose: utils.onUpdateTableData,
            body: '$preset.forms.updateTable',
          },
        },
        delTable: {
          limits: 'del',
          type: 'action',
          icon: 'fa fa-times pull-left',
          level: 'danger',
          actionType: 'ajax',
          label: '删除',
          confirmText: '删除后将不可恢复，您确认要删除模型【$name】 吗?',
          api: '$preset.apis.delTable',
          messages: {
            success: '删除成功',
            failed: '删除失败',
          },
        },
        addField: {
          limits: 'add',
          type: 'button',
          align: 'right',
          label: '添加字段',
          icon: 'fa fa-plus pull-left',
          size: 'sm',
          primary: true,
          actionType: 'drawer',
          drawer: {
            position: 'right',
            title: '添加一个字段',
            size: 'md',
            data: {
              id: '$id',
            },
            body: {
              $preset: 'forms.updateField',
              api: {
                $preset: 'apis.addField',
                onPreRequest: utils.onPreUpdateFiledReq,
                onSuccess: utils.markTableListDataDirty,
              },
            },
          },
        },
        batchAddField: {
          limits: 'add',
          type: 'button',
          align: 'right',
          actionType: 'dialog',
          label: '快速添加',
          icon: 'fa fa-paper-plane-o pull-left',
          dialog: {
            position: 'right',
            title: '快速添加字段',
            size: 'md',
            body: {
              $preset: 'forms.batchAddField',
            },
          },
        },
        copyAddField: {
          limits: 'add',
          type: 'button',
          align: 'right',
          label: '复制添加',
          icon: 'fa fa-copy pull-left',
          actionType: 'dialog',
          dialog: {
            title: '复制添加字段',
            size: 'md',
            body: {
              $preset: 'forms.copyAddField',
            },
          },
        },
        copyField: {
          limits: 'edit',
          type: 'button',
          icon: 'fa fa-copy',
          tooltip: '复制字段',
        },
        editField: {
          limits: 'edit',
          type: 'button',
          icon: 'fa fa-pencil',
          tooltip: '编辑字段',
          actionType: 'drawer',
          drawer: {
            position: 'right',
            title: '编辑字段',
            size: 'md',
            body: {
              $preset: 'forms.updateField',
              api: {
                $preset: 'apis.editField',
                onPreRequest: utils.onPreUpdateFiledReq,
                onSuccess: utils.markTableListDataDirty,
              },
            },
          },
        },
        delField: {
          limits: 'del',
          type: 'button',
          icon: 'fa fa-times text-danger',
          actionType: 'ajax',
          tooltip: '删除字段',
          confirmText: '删除后将不可恢复，您确认要删除模型【$name】 吗?',
          api: {
            $preset: 'apis.delField',
            onSuccess: utils.markTableListDataDirty,
          },
          messages: {
            success: '删除成功',
            failed: '删除失败',
          },
        },
      },
      forms: {
        switchMode: {
          type: 'form',
          mode: 'inline',
          target: 'page',
          wrapWithPanel: false,
          controls: [
            {
              type: 'button-group',
              name: 'displayMode',
              value: 'list',
              submitOnChange: true,
              onChange: (mode: string) => {
                utils.displayModeCtrl('set', mode)
              },
              options: [
                {
                  label: '列表',
                  icon: 'fa fa-list pull-left',
                  value: 'list',
                },
                {
                  label: '图示',
                  icon: 'fa fa-th-large pull-left',
                  value: 'diagram',
                },
              ],
            },
          ],
        },
        addTable: {
          type: 'service',
          api: '$preset.apis.fakeTableTemplate',
          body: {
            type: 'form',
            mode: 'horizontal',
            wrapWithPanel: false,
            className: 'p-lg',
            api: {
              $preset: 'apis.addTable',
              onPreRequest: utils.onPreUpdateTableReq,
            },
            controls: [
              {
                type: 'lib-renderer',
                source: 'table',
                renderer: 'sysSchemaService',
                onSuccess: utils.onTableInfoSchemaSuc,
              },
            ],
          },
        },
        updateTable: {
          type: 'lib-css',
          css: ({ ns }) => `
            .${ns}Table {
              border: 0;
            }
            .${ns}Table-toolbar {
              padding-left: 0;
            }
        `,
          body: {
            type: 'tabs',
            mode: 'vertical',
            tabs: [
              {
                title: '设置字段',
                tab: {
                  type: 'service',
                  data: {
                    '&': '$$',
                    items: [],
                  },
                  body: {
                    type: 'lib-crud',
                    api: {
                      $preset: 'apis.tableInfo',
                      columnsTogglable: false,
                      affixHeader: false,
                      onSuccess: utils.onGetTableFileSuc,
                    },
                    loadDataOnce: true,
                    filter: false,
                    draggable: true,
                    headerToolbar: [
                      {
                        align: 'left',
                        $preset: 'actions.addField',
                      },
                      {
                        align: 'left',
                        $preset: 'actions.batchAddField',
                      }, // copyAddField
                      {
                        align: 'left',
                        $preset: 'actions.copyAddField',
                      },
                    ],
                    columns: [
                      {
                        type: 'operation',
                        label: '字段操作',
                        width: 100,
                        limits: ['edit', 'del'],
                        limitsLogic: 'or', // 满足 limits列表中 一个权限即可渲染
                        buttons: [
                          '$preset.actions.editField',
                          '$preset.actions.copyField',
                          '$preset.actions.delField',
                        ],
                      },
                      ...tpl.getTableFieldColumn(),
                    ],
                  },
                },
              },
              {
                title: '基本信息',
                tab: [
                  {
                    type: 'service',
                    api: '$preset.apis.fakeTableTemplate',
                    body: {
                      type: 'form',
                      mode: 'horizontal',
                      wrapWithPanel: false,
                      className: 'p-md',
                      api: {
                        $preset: 'apis.editTable',
                        onPreRequest: utils.onPreUpdateTableReq,
                        onSuccess: utils.onTableInfoSchemaSuc,
                      },
                      controls: [
                        {
                          type: 'lib-renderer',
                          source: 'table',
                          renderer: 'sysSchemaService',
                          onSuccess: utils.onTableInfoSchemaSuc,
                        },
                        {
                          type: 'divider',
                        },
                        {
                          type: 'container',
                          mode: 'inline',
                          body: [
                            {
                              limits: 'add',
                              type: 'action',
                              actionType: 'submit',
                              className: 'm-r-md',
                              primary: true,
                              label: '保存信息',
                              icon: 'fa fa-check pull-left',
                              size: 'md',
                            },
                            {
                              limits: 'add',
                              type: 'action',
                              actionType: 'close',
                              label: '关闭',
                              icon: 'fa fa-check pull-left',
                              size: 'md',
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        batchAddField: {
          type: 'form',

          controls: [
            {
              type: 'textarea',
              name: 'namse',
              label: '字段名称',
              desc: '仅填写字段名称，多个字段用逗号隔开',
            },
          ],
        },
        updateField: {
          type: 'form',
          mode: 'horizontal',
          controls: [
            {
              type: 'text',
              name: 'name',
              label: '字段名称',
              required: true,
              desc: '用于区分数据模型的每一个属性，同一模型的名字不能重复',
            },
            {
              type: 'textarea',
              name: 'desc',
              label: '字段描述',
              desc: '字段底部显示的描述信息',
            },
            {
              name: 'beanType',
              type: 'select',
              source: {
                url: 'fakeFieldTypeOpts',
                onFakeRequest: utils.onFakeFieldTypeOpts,
              },
              label: '字段类型',
              value: 'TEXT',
              required: true,
            },
            {
              name: 'isNull',
              type: 'switch',
              required: true,
              label: '是否必须',
              falseValue: 1,
              trueValue: 0,
              value: 1,
            },
            {
              type: 'lib-renderer',
              initFetchSchemaOn: 'data.beanType',
              updateDeps: ['beanType'],
              renderer: 'sysSchemaService',
              onSuccess: utils.onTableFieldSchemaSuc,
            },
          ],
        },
        copyAddField: {
          type: 'form',
          mode: 'normal',
          controls: [
            {
              $ref: 'fieldsTransfer',
            },
          ],
        },
      },
    },
  },
}

// type: 'form',
// mode: 'normal',
// type: 'form',
// api: '$preset.apis.add',
// mode: 'normal',
// $preset: 'forms.add',
