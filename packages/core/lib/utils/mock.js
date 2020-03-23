/**
 * Mock数据 一些简单封装
 */
import { uuid } from 'amis/lib/utils/helper';
import produce from 'immer';
import dropWhile from 'lodash/dropWhile';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import pick from 'lodash/pick';
import times from 'lodash/times';
const defaultApiRes = { code: 0 };
export class MockListStore {
    constructor(option) {
        this.list = [];
        this.idField = 'id';
        // public batchDeleteById() {}
        this.generator = () => ({});
        const { count = 20, generator, idField = 'id' } = option;
        this.list = times(count, generator);
        this.generator = generator;
        this.idField = idField;
    }
    getList() {
        return this.list;
    }
    search(query) {
        return !query ? this.list : query(this.list);
    }
    add(data, option) {
        const { updater, response } = this.resolveOption(data, option);
        const itemData = this.getItemData(data);
        const newItem = Object.assign(Object.assign(Object.assign({}, itemData), updater), { [this.idField]: uuid() });
        this.list = produce(this.list, (d) => {
            d.unshift(newItem);
        });
        return response;
    }
    updateById(data, option) {
        const { updater, response } = this.resolveOption(data, option);
        const { idx, itemData } = this.getItemInfo(data);
        if (idx > -1 && this.list[idx]) {
            this.list = produce(this.list, (d) => {
                if (updater) {
                    d[idx] = Object.assign(Object.assign({}, itemData), updater);
                    return;
                }
                map(itemData, (val, key) => {
                    d[idx][key] = val;
                });
            });
        }
        return response;
    }
    // public updateBy() {}
    // public batchUpdateBy() {}
    // public batchUpdateById() {}
    deleteById(data, option) {
        const { response } = this.resolveOption(data, option);
        const { idx } = this.getItemInfo(data);
        this.list = produce(this.list, (d) => {
            d.splice(idx, 1);
        });
        return response;
    }
    deleteBy(predicate, option) {
        const { response } = this.resolveOption({}, option);
        this.list = produce(this.list, (d) => {
            dropWhile(d, predicate);
        });
        return response;
    }
    resolveOption(data, option) {
        const { updater, response = defaultApiRes } = option;
        let update = updater;
        if (typeof updater === 'function') {
            update = updater(data);
        }
        return {
            updater: update,
            response,
        };
    }
    getItemInfo(data) {
        const itemData = this.getItemData(data);
        const idx = findIndex(this.list, { [this.idField]: itemData[this.idField] });
        return {
            idx,
            itemData,
        };
    }
    getItemData(data) {
        return pick(data, Object.keys(this.generator(0)));
    }
}
export const mockResSuccess = (data) => {
    return {
        data,
        code: 0,
    };
};
export const mockResError = (...args) => {
    const [code, message = 'mock错误请求', error] = args;
    return {
        code,
        msg: message,
        message,
        error,
    };
};
