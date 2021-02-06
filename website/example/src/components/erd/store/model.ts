import { toast } from 'amis'
import { uuid } from 'amis/lib/utils/helper'

import { types, flow } from 'mobx-state-tree'

import { fetchTableById, fetchTables } from '../helper/api'

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
    tableId: types.maybeNull(types.string),
    fields: types.array(FiledModel),
    x: types.maybeNull(types.number),
    y: types.maybeNull(types.number),
  })
  .actions((self) => {
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

    return {
      refreshInfo,
      resetInfo,
      setInfo,
    }
  })

export const DataModel = types
  .model('ErdDataModel', {
    loading: true,
    tables: types.array(TableModel),
  })
  .actions((self) => {
    const fetchTablesData = flow(function*() {
      self.loading = true
      try {
        self.tables = yield fetchTables()
        self.loading = false
      } catch (error) {
        toast.error('加载模型列表数据出错')
        self.loading = false
      }
    })

    const addTable = (options = {}) => {
      const uid = uuid()
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

    return {
      addTable,
      fetchTablesData,
    }
  })

export const modelStore = DataModel.create({
  tables: [],
})
