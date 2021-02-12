import { uuid } from 'amis/lib/utils/helper'

import { types } from 'mobx-state-tree'

import { rmActiveEndpoint } from '../components/graph/canvas'

export const AsideModel = types
  .model('ErdAsideModel', {
    searchMode: types.boolean,
    sortMode: types.number, // 0直接关闭 1保存关闭 2显示
    searchText: types.string,
    focusActiveKey: types.string,
  })
  .views((self) => {
    return {
      get withSearch() {
        return self.searchMode && !!self.searchText
      },
      get sortToggle() {
        // 只有 2 会显示
        return self.sortMode === 2
      },
    }
  })
  .actions((self) => {
    const toggleSortMode = (toggle?: any) => {
      const sortMode = typeof toggle === 'number' ? toggle : self.sortToggle ? 0 : 2
      rmActiveEndpoint()
      self.sortMode = sortMode
    }

    const setSearchText = (text: string = '') => {
      rmActiveEndpoint()
      self.searchText = text
    }

    const focusActiveNode = () => {
      self.focusActiveKey = uuid()
    }

    return {
      focusActiveNode,
      setSearchText,
      toggleSortMode,
    }
  })

export const asideStore = AsideModel.create({
  searchMode: true,
  sortMode: 0,
  searchText: '',
  focusActiveKey: '',
})
