import { toast } from 'amis'

import { types, flow } from 'mobx-state-tree'

import { fetchTableById, fetchTables } from '../helper/api'

const FiledModel = types.model('ErdFieldModel', {
  id: '',
  label: '',
  desc: '',
  type: '',
  required: false,
  unique: false,
})

const TableModel = types
  .model('ErdTableModel', {
    loading: false,
    id: '',
    label: '',
    desc: '',
    fields: types.array(FiledModel),
  })
  .actions((self) => {
    const refreshInfo = flow(function*() {
      try {
        self.loading = true
        const { label, desc, fields } = yield fetchTableById(self.id)
        self.label = label
        self.desc = desc
        self.fields = fields
        self.loading = false
      } catch (e) {
        toast.error('更新模型数据出错')
        self.loading = false
      }
    })

    return {
      refreshInfo,
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

    return {
      fetchTablesData,
    }
  })

export const modelStore = DataModel.create({
  tables: [],
})
