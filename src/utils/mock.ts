/**
 * Mock数据需要用到的工具
 */

import { uuid } from 'amis/lib/utils/helper'
import produce from 'immer'
import dropWhile from 'lodash/dropWhile'
import findIndex from 'lodash/findIndex'
import map from 'lodash/map'
import pick from 'lodash/pick'
import times from 'lodash/times'

type MockListStoreOption<T = {}> = {
  generator: (index: number) => T
  idField?: string
  count?: number
}

type Updater<T = {}> = Partial<T> | ((d: Partial<T>) => Partial<T>)

export class MockListStore<T = {}> {
  private list: T[] = []
  private idField: string = 'id'

  constructor(option: MockListStoreOption<T>) {
    const { count = 20, generator, idField = 'id' } = option
    this.list = times(count, generator)
    this.generator = generator
    this.idField = idField
  }

  public getList() {
    return this.list
  }

  public search(query?: (item: T) => boolean) {
    return !query ? this.list : this.list.filter(query)
  }

  public add(data: T, updater?: Updater<T>) {
    const itemData = this.getItemData(data)
    const newItem: any = {
      ...itemData,
      ...this.getUpdateData(data, updater),
      [this.idField]: uuid(),
    }
    this.list = produce(this.list, (d) => {
      d.unshift(newItem)
    })
  }

  public updateById(data: T, updater?: Updater<T>) {
    const { idx, itemData } = this.getItemInfo(data)
    if (idx > -1 && this.list[idx]) {
      this.list = produce(this.list, (d: any) => {
        if (updater) {
          d[idx] = {
            ...itemData,
            ...this.getUpdateData(data, updater),
          }
          return
        }
        map(itemData, (val, key) => {
          d[idx][key] = val
        })
      })
    }
  }

  // public updateBy() {}
  // public batchUpdateBy() {}
  // public batchUpdateById() {}

  public deleteById(data: T) {
    const { idx } = this.getItemInfo(data)
    this.list = produce(this.list, (d) => {
      d.splice(idx, 1)
    })
  }

  public deleteBy(predicate: (data: T) => boolean) {
    this.list = produce(this.list, (d: any) => {
      dropWhile(d, predicate)
    })
  }

  // public batchDeleteById() {}

  private generator: any = () => ({})

  private getUpdateData(data: T, updater?: Updater<T>) {
    let update = updater

    if (typeof updater === 'function') {
      update = updater(data)
    }
    return update
  }

  private getItemInfo(data: T) {
    const itemData: any = this.getItemData(data)
    const idx = findIndex<any>(this.list, { [this.idField]: itemData[this.idField] })
    return {
      idx,
      itemData,
    }
  }

  private getItemData(data: T): Partial<T> {
    return pick(data, Object.keys(this.generator(0)))
  }
}
