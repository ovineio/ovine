import { types } from 'mobx-state-tree'

export const AsideModel = types.model('ErdAsideModel', {
  searchMode: false,
  searchText: '',
})

export const asideStore = AsideModel.create({})
