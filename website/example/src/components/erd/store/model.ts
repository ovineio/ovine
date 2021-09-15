import { toast } from 'amis'
import { uuid } from 'amis/lib/utils/helper'
import { uniqueId } from 'lodash'

import { types, flow } from 'mobx-state-tree'

import { fetchTableById, fetchModelMap } from '../helper/api'

const FiledModel = types
  .model('ErdFieldModel', {
    id: '',
    name: '',
    desc: '',
    typeLabel: '',
    isEditing: false,
  })
  .volatile(() => {
    return {
      tableInfo: {} as any,
    }
  })
  .actions((self) => {
    const setTableInfo = (info) => {
      self.tableInfo = info
    }

    const setInfo = (key, value) => {
      self[key] = value
    }

    return {
      setTableInfo,
      setInfo,
    }
  })

const TableModel = types
  .model('ErdTableModel', {
    loading: false,
    id: '',
    name: '',
    desc: '',
    isEditing: false,
    refreshKey: 0,
    fields: types.array(FiledModel),
    x: types.maybeNull(types.number),
    y: types.maybeNull(types.number),
  })
  .actions((self) => {
    const getFiledIndex = (id: string) => {
      return self.fields.findIndex((i) => i.id === id)
    }

    const countSameName = (text: string) => {
      let count = 0
      self.fields.forEach(({ name }) => {
        if (name.indexOf(text) > -1) {
          count += 1
        }
      })
      return count
    }

    const resetInfo = (info) => {
      self.name = info.name
      self.desc = info.desc
      self.fields = info.fields
    }

    const refreshInfo = flow(function*() {
      try {
        self.loading = true
        const { name, desc, fields } = yield fetchTableById(self.id)
        self.name = name
        self.desc = desc
        self.fields = fields
        self.loading = false
      } catch (e) {
        toast.error('更新模型数据出错')
        self.loading = false
      }
    })

    const setInfo = (key, value) => {
      self[key] = value
    }

    const addField = (id: string): string => {
      const index = getFiledIndex(id)
      const uid = uuid() + uniqueId()
      self.fields.splice(index + 1, 0, {
        id: uid,
        name: `新增字段-${countSameName('新增字段-') + 1}`,
        typeLabel: '短文本',
        isEditing: true,
      })
      return uid
    }

    const copyField = (id: string): string => {
      const index = getFiledIndex(id)
      const field = self.fields[index]
      const uid = uuid() + uniqueId()
      self.fields.splice(index + 1, 0, {
        ...field,
        id: uid,
        name: `${field.name.replace(/-复.*$/gi, '')}-复制${countSameName('-复制') || ''}`,
      })
      return uid
    }

    const removeField = (id: string): string => {
      const index = getFiledIndex(id)
      self.fields.splice(index, 1)
      return self.fields[index - 1]?.id || ''
    }

    const batchAddFields = (names: string[]) => {
      self.fields.push(
        ...names.map((name) => {
          const uid = uuid() + uniqueId()
          return {
            id: uid,
            name,
            desc: '',
            typeLabel: '短文本',
            isEditing: true,
          }
        })
      )
      self.refreshKey += 1
    }

    const sortFields = (orderArr: string[]) => {
      if (self.fields.map(({ id }) => id).join(',') !== orderArr.join(',')) {
        self.refreshKey += 1
        self.fields = self.fields.sort((a, b) => {
          return orderArr.indexOf(a.id) - orderArr.indexOf(b.id)
        })
      }
    }

    return {
      refreshInfo,
      resetInfo,
      setInfo,
      addField,
      copyField,
      removeField,
      batchAddFields,
      sortFields,
    }
  })

const Relation = types.model('relation', {
  sourceTableId: 0,
  sourceFiledId: 0,
  targetTableId: 0,
  targetFiledId: 0,
  sourceType: 0,
  targetType: 0,
})

export const DataModel = types
  .model('ErdDataModel', {
    loading: true,
    refreshKey: 0,
    orderIds: types.array(types.string),
    tables: types.array(TableModel),
    relation: types.array(Relation),
    // edges: types.array(EdgeModel),
  })
  .views((self) => {
    return {
      get orderedTables() {
        if (!self.orderIds.length) {
          return self.tables
        }
        const tables = self.tables.sort((a, b) => {
          return self.orderIds.indexOf(a.id) - self.orderIds.indexOf(b.id)
        })
        return tables
      },
    }
  })
  .actions((self) => {
    const getTableIndex = (id: string) => {
      return self.tables.findIndex((i) => i.id === id)
    }

    const fetchTablesData = flow(function*() {
      self.loading = true
      try {
        const { tables } = yield fetchModelMap()
        self.tables = tables || []
        self.loading = false
      } catch (error) {
        toast.error('加载模型列表数据出错')
        self.loading = false
      }
    })

    const addTable = (options = {}) => {
      const uid = uuid() + uniqueId()
      self.tables.push({
        id: uid,
        name: `新添加模型-${self.tables.length + 1}`,
        desc: '新添加',
        fields: [],
        isEditing: true,
        ...options,
      })
      return uid
    }

    // const addEdge = (options: any) => {
    //   self.edges.push({
    //     id: `${options.source}${erdOther.epLinkKey}${options.target}`,
    //     type: 'endpoint',
    //     ...options,
    //   })
    // }

    // const removeEdge = (id: string) => {
    //   const idx = self.edges.findIndex((i) => i.id === id)
    //   console.log('123===>', idx, id)
    //   self.edges.splice(idx, 1)
    // }

    const removeTable = (id: string) => {
      const index = getTableIndex(id)
      self.tables.splice(index, 1)
    }

    const setOrderIds = (orderArr: string[]) => {
      self.orderIds = orderArr as any
    }

    return {
      addTable,
      removeTable,
      setOrderIds,
      fetchTablesData,
    }
  })

export const modelStore = DataModel.create({
  tables: [],
  orderIds: [],
  // edges: [],
})
