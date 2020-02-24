/**
 * Mock数据 一些简单封装
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

type OperationOption<S = {}, P = {}> = {
  updater?: Updater<S>
  response?: Req.ServerApiRes<P>
}

const defaultApiRes: Req.ServerApiRes<any> = { code: 0 }

export class MockListStore<S = {}, P = S> {
  private list: S[] = []
  private idField: string = 'id'

  constructor(option: MockListStoreOption<S>) {
    const { count = 20, generator, idField = 'id' } = option
    this.list = times(count, generator)
    this.generator = generator
    this.idField = idField
  }

  public getList() {
    return this.list
  }

  public search(query?: (list: S[]) => S[]) {
    return !query ? this.list : query(this.list)
  }

  public add(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S> {
    const { updater, response } = this.resolveOption(data, option)
    const itemData = this.getItemData(data)
    const newItem: any = {
      ...itemData,
      ...updater,
      [this.idField]: uuid(),
    }
    this.list = produce(this.list, (d) => {
      d.unshift(newItem)
    })

    return response
  }

  public updateById(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S> {
    const { updater, response } = this.resolveOption(data, option)
    const { idx, itemData } = this.getItemInfo(data)
    if (idx > -1 && this.list[idx]) {
      this.list = produce(this.list, (d: any) => {
        if (updater) {
          d[idx] = {
            ...itemData,
            ...updater,
          }
          return
        }
        map(itemData, (val, key) => {
          d[idx][key] = val
        })
      })
    }

    return response
  }

  // public updateBy() {}
  // public batchUpdateBy() {}
  // public batchUpdateById() {}

  public deleteById(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S> {
    const { response } = this.resolveOption(data, option)
    const { idx } = this.getItemInfo(data)
    this.list = produce(this.list, (d) => {
      d.splice(idx, 1)
    })
    return response
  }

  public deleteBy(
    predicate: (data: P) => boolean,
    option: OperationOption<S, P>
  ): Req.ServerApiRes<S> {
    const { response } = this.resolveOption({} as any, option)

    this.list = produce(this.list, (d: any) => {
      dropWhile(d, predicate)
    })

    return response
  }

  // public batchDeleteById() {}

  private generator: any = () => ({})

  private resolveOption(data: P, option: OperationOption<S, P>) {
    const { updater, response = defaultApiRes } = option
    let update = updater

    if (typeof updater === 'function') {
      update = updater(data)
    }

    return {
      updater: update,
      response,
    }
  }

  private getItemInfo(data: P) {
    const itemData: any = this.getItemData(data)
    const idx = findIndex<any>(this.list, { [this.idField]: itemData[this.idField] })
    return {
      idx,
      itemData,
    }
  }

  private getItemData(data: P): Partial<P> {
    return pick(data, Object.keys(this.generator(0)))
  }
}

export const mockResSuccess = <T>(data: T) => {
  return {
    data,
    code: 0,
  }
}

export const mockResError = (...args: any[]) => {
  const [code, message = 'mock错误请求', error] = args
  return {
    code,
    msg: message,
    message,
    error,
  }
}
