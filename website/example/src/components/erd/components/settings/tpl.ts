import { toPairs } from 'lodash'

import { getModelTplData, modelUtils } from '../../helper/api'

export const getUpdateTableSchema = (options) => {
  const formSchema = modelUtils.onTableInfoSchemaSuc(getModelTplData().table)

  const schema = {
    type: 'page',
    bodyClassName: 'schema-body',
    data: options.data,
    body: {
      type: 'form',
      mode: 'normal',
      onChange: (_, diff) => {
        const [key, value] = toPairs(diff)[0]
        options.setInfo(key, value)
      },
      wrapWithPanel: false,
      controls: formSchema.controls,
    },
  }

  return schema
}

export const getUpdateFieldSchema = (options) => {
  const schema = {
    type: 'page',
    bodyClassName: 'schema-body',
    data: options.data,
    body: {
      type: 'form',
      mode: 'normal',
      wrapWithPanel: false,
      onChange: (_, diff) => {
        const [key, value] = toPairs(diff)[0]
        options.setInfo(key, value)
      },
      controls: [
        {
          type: 'text',
          name: 'name',
          label: '字段名称',
          required: true,
          desc: '用于区分数据模型的每一个属性，同一模型的名字不能重复',
        },
        {
          name: 'beanType',
          type: 'select',
          source: {
            url: 'fakeFieldTypeOpts',
            onFakeRequest: modelUtils.onFakeFieldTypeOpts,
          },
          label: '字段类型',
          value: 'TEXT',
          required: true,
        },
        {
          type: 'textarea',
          name: 'desc',
          label: '字段描述',
          desc: '字段底部显示的描述信息',
        },
        {
          name: 'isNull',
          type: 'switch',
          required: true,
          label: '是否必填',
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

  return schema
}
