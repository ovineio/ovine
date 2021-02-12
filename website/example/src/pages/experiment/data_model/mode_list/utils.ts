import { get, map, isObject, omit, cloneDeep, pick } from 'lodash'

import { app } from '@core/app'
import { getGlobal, getStore, setGlobal, setStore } from '@core/utils/store'

import { erdStoreKey } from '~/components/erd/constants'

let scopeRef: any = {}
const modeStoreKey = 'dataCenterDisplayMode'

export const displayModeCtrl = (type: 'get' | 'set', value?: string) => {
  if (type === 'get') {
    return getStore(modeStoreKey) || 'list'
  }

  setStore(modeStoreKey, value || 'list')

  return ''
}

export const getModelTemplate = () => {
  return getGlobal<any>(erdStoreKey.modelTemplate) || {}
}

export const scopeRefProp = (ref) => {
  scopeRef = ref
}

const transAttrsToSchema = (attrs) => {
  const controls = []

  map(attrs, (val, key) => {
    if (isObject(val)) {
      controls.push({
        name: key,
        ...val,
      })
    }
  })

  return { controls }
}

const applyValueToAttrs = (attrs, table) => {
  const result: any = {}

  map(attrs, (val, key) => {
    if (isObject(val)) {
      result[key] = {
        ...val,
        value: table[key],
      }
    }
  })

  if (attrs.beanType) {
    result.beanType = attrs.beanType
  }

  return result
}

export const getTableFormData = (apiSource) => {
  const { addTime, updateTime, table, fields } = apiSource

  const data = {
    addTime,
    updateTime,
    id: `${get(table, 'id.value')}`,
    name: get(table, 'name.value'),
    desc: get(table, 'desc.value'),
    fields: getTableFieldList(fields),
  }

  return data
}

export const getFieldFormData = (apiSource) => {
  const {
    name: typeLabel,
    desc: typeDesc,
    beanType,
    addTime,
    updateTime,
    attributes,
    id,
  } = apiSource
  const fieldData = {
    id: `${id}`,
    typeLabel,
    typeDesc,
    addTime,
    updateTime,
    beanType,
    extra: [],
  }
  const fiedKeys = ['name', 'desc', 'isNull']
  map(attributes, (item, key) => {
    if (fiedKeys.includes(key)) {
      fieldData[key] = item.value
    } else {
      fieldData.extra.push(pick(item, ['value', 'label']))
    }
  })

  return fieldData
}

export const getTableFieldList = (fields = []) => {
  const fieldsData = []
  fields.forEach((field) => {
    fieldsData.push(getFieldFormData(field))
  })

  return fieldsData
}

export const fetchModelTplData = () => {
  app
    .request({
      url: 'GET ovhapi/model/template',
    })
    .then((source) => {
      setGlobal(erdStoreKey.modelTemplate, source.data.data)
    })
}

export const onGetTableListSuc = async (source) => {
  await fetchModelTplData()

  const data = source.data || []

  const items = data.map((item) => {
    return getTableFormData(item)
  })

  source.data = {
    items,
  }

  return source
}

export const onPreUpdateTableReq = (source) => {
  const { table } = getModelTemplate()
  const { id } = source.data
  const attrs = applyValueToAttrs(table, source.data)

  source.data = id
    ? attrs
    : {
        table: attrs,
      }

  return source
}

export const onPreUpdateFiledReq = (source) => {
  const { fieldModel } = getModelTemplate()
  const { beanType } = source.data
  const fieldItem = fieldModel.find((i) => i.beanType === beanType) || []

  const reqData = cloneDeep(fieldItem)

  reqData.attributes = applyValueToAttrs(fieldItem.attributes, source.data)

  source.data = reqData

  return source
}

export const onTableInfoSchemaSuc = (source) => {
  const schema = transAttrsToSchema(source)
  schema.controls.push({
    type: 'hidden',
    value: '',
    name: 'id',
  })
  return schema
}

export const onTableFieldSchemaSuc = (source) => {
  const { fieldModel } = getModelTemplate()
  const { beanType } = source

  const fieldItem = fieldModel.find((i) => i.beanType === beanType) || {}

  const attrs = omit(fieldItem.attributes, ['name', 'desc', 'isNull']) || {}

  return !attrs ? null : transAttrsToSchema(attrs)
}

export const onGetTableFileSuc = (source) => {
  const { fields } = source.data
  source.data = {
    items: getTableFieldList(fields),
  }

  return source
}

export const onGetFieldOptsSuc = (source) => {
  const apiData = source.data || {}
  const options = []

  apiData.forEach((item) => {
    const { table, fields = [] } = item
    if (fields.length) {
      options.push({
        label: get(table, 'name.value'),
        children: fields.map((filed) => {
          return {
            label: `[${filed.name}]  ${get(filed, 'attributes.name.value')}`,
            value: get(filed, 'id.value'),
          }
        }),
      })
    }
  })

  source.data = { options }

  return source
}

// TODO 类型需要动态 确定可更改的类型
export const onFakeFieldTypeOpts = () => {
  const { fieldModel } = getGlobal(erdStoreKey.modelTemplate)
  const fieldTypeOpts = []
  fieldModel.forEach((field) => {
    const { name, desc, beanType } = field
    fieldTypeOpts.push({
      value: beanType,
      label: name,
      desc,
    })
  })

  return {
    data: {
      options: fieldTypeOpts,
    },
  }
}

export const markTableListDataDirty = (source?: any) => {
  scopeRef.isDirty = true
  return source
}

export const onUpdateTableData = async () => {
  if (scopeRef.isDirty) {
    const modelTableList = scopeRef.getComponentByName('page.modelTableList')
    const source = await app.request({
      url: 'GET ovhapi/model/table',
    })
    const apiData = await onGetTableListSuc(source.data)
    // TODO: 保持展开的状态
    // console.log('@@@@==>>', modelTableList.control.props.store)
    modelTableList.props.store.reInitData(apiData.data) // .initFromScope(apiData.data, '$items')
    scopeRef.isDirty = false
    // console.log('@====>1111', a, scopeRef.parent.getComponents())
  }
}
