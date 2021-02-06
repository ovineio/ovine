import { modelApis, modelUtils } from '../../helper/api'

export const updateTableSchema = {
  type: 'page',
  bodyClassName: 'schema-body',
  body: {
    type: 'service',
    api: modelApis.fakeTableTemplate,
    body: {
      type: 'form',
      mode: 'normal',
      wrapWithPanel: false,
      api: {
        ...modelApis.addTable,
        onPreRequest: modelUtils.onPreUpdateTableReq,
      },
      controls: [
        {
          type: 'lib-renderer',
          source: 'table',
          renderer: 'sysSchemaService',
          onSuccess: modelUtils.onTableInfoSchemaSuc,
        },
      ],
    },
  },
}

export const updateFieldSchema = {
  type: 'page',
  bodyClassName: 'schema-body',
  body: {
    type: 'form',
    mode: 'normal',
    wrapWithPanel: false,
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
          url: modelApis.fakeFieldTypeOpts,
          onFakeRequest: modelUtils.onFakeFieldTypeOpts,
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
        onSuccess: modelUtils.onTableFieldSchemaSuc,
      },
    ],
  },
}
