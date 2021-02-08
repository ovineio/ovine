import { uuid } from 'amis/lib/utils/helper'

import { types } from 'mobx-state-tree'

export const AsideModel = types
  .model('ErdAsideModel', {
    searchMode: types.boolean,
    sortMode: types.boolean,
    searchText: types.string,
    focusActiveKey: types.string,
  })
  .views((self) => {
    return {
      get withSearch() {
        return self.searchMode && !!self.searchText
      },
    }
  })
  .actions((self) => {
    const toggleSearchMode = (toggle?: any) => {
      const isSearchMode = typeof toggle === 'boolean' ? toggle : !self.searchMode
      self.searchMode = isSearchMode
    }

    const toggleSortMode = (toggle?: any) => {
      const isSort = typeof toggle === 'boolean' ? toggle : !self.sortMode
      self.sortMode = isSort
    }

    const setSearchText = (text: string = '') => {
      self.searchText = text
    }

    const focusActiveNode = () => {
      self.focusActiveKey = uuid()
    }

    return {
      toggleSearchMode,
      focusActiveNode,
      setSearchText,
      toggleSortMode,
    }
  })

export const asideStore = AsideModel.create({
  searchMode: true,
  sortMode: false,
  searchText: '',
  focusActiveKey: '',
})
