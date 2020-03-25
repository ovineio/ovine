/**
 * 封装 fetch 请求
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable consistent-return */
// eslint-disable-next-line
import { qsstringify } from 'amis/lib/utils/helper';
import { filter } from 'amis/lib/utils/tpl';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import { fetch } from 'whatwg-fetch';
import logger from "../logger";
import { getSessionStore, setSessionStore } from "../store";
import { isExpired, getQuery, timeout } from "../tool";
const log = logger.getLogger('lib:utils:request');
// 请求错误集中处理， 必须 throw 错误
function requestErrorCtrl(option, response, error) {
    const { onError: handle = false } = option;
    log.info('requestErrorCtrl', { response, error });
    if (this.onError) {
        this.onError({ option, response, error });
    }
    // 不执行全局 onError
    if (handle) {
        handle({ option, error, source: response });
    }
    if (this.onFinish) {
        this.onFinish({ option, response, error });
    }
}
// 模拟数据
const mockSourceCtrl = (option) => __awaiter(void 0, void 0, void 0, function* () {
    const { mockSource, onSuccess, sourceKey = '', api, url, mock = true, mockTimeout = 300 } = option;
    // 预览打包，暂时去掉 config.isProd 限制
    // config.isProd || !mockSource
    if (!mock || !mockSource) {
        return 'none';
    }
    const apiStr = api || url;
    // mock数据生成方式
    const mockSourceGen = get(mockSource, apiStr) ? mockSource[apiStr] : mockSource;
    // mock 原始数据
    const source = typeof mockSourceGen === 'function' ? mockSourceGen(option) : mockSourceGen;
    const data = !sourceKey ? source : get(source, sourceKey);
    // mock 最终返回结果
    const result = !onSuccess ? data : yield onSuccess(data, option);
    if (mockTimeout) {
        yield timeout(mockTimeout);
    }
    log.log('mockSource', option.url, result, option);
    return result;
});
// 只缓存 GET 请求
const cacheSourceCtrl = (type, option, resource) => {
    const { url = '', expired = 0, method = 'GET' } = option || {};
    if (!expired || method !== 'GET') {
        return;
    }
    const timestampKey = `${url}:timestamp`;
    if (type === 'set') {
        // 不存在 resource 直接返回
        if (!resource) {
            return;
        }
        // 所有数据按照 字符串缓存
        setSessionStore(url, resource);
        setSessionStore(timestampKey, (Date.now() + expired * 1000).toString());
        return;
    }
    if (type === 'get') {
        const cached = getSessionStore(url);
        const whenExpired = getSessionStore(timestampKey);
        if (cached && whenExpired) {
            if (!isExpired(whenExpired)) {
                log.log('cacheSource', option.url, cached, option);
                return cached;
            }
        }
    }
};
// 发出请求
function fetchSourceCtrl(option) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, sourceKey, onSuccess } = option;
        const reqOption = !this.onRequest ? option : this.onRequest(option);
        const result = yield fetch(url, reqOption)
            .catch((error) => {
            requestErrorCtrl.call(this, option, {}, error);
        })
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            // 当 fetch 发生错误时 不做任何处理
            if (!response) {
                return;
            }
            const status = Number(response.status);
            if (status <= 100 || status >= 400) {
                requestErrorCtrl.call(this, option, response, new Error('status <= 100 || status >= 400'));
            }
            let origin = response.json();
            if (this.onResponse) {
                origin = this.onResponse({ option, response, source: origin });
            }
            const source = !sourceKey ? origin : get(origin, sourceKey);
            const data = !onSuccess ? source : yield onSuccess(source, option);
            if (this.onFinish) {
                this.onFinish({ option, response, source: data });
            }
        }));
        return result;
    });
}
// 获取 fetch 参数
function getFetchOption(option) {
    const { data = {}, body, headers, fetchOption: fetchOpt = {} } = option;
    const { url, method } = getUrlByOption.call(this, option);
    const hasBody = !/GET|HEAD/.test(method);
    const fetchOption = Object.assign(Object.assign({}, fetchOpt), { url,
        method, headers: Object.assign({ Accept: 'application/json' }, headers) });
    if (!body && !fetchOption.headers['Content-Type']) {
        fetchOption.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    if (hasBody) {
        fetchOption.body = body || JSON.stringify(data);
    }
    return fetchOption;
}
export function getUrlByOption(option) {
    const { url = '', data = {}, method = 'GET', domain = 'api', domains } = option;
    let realUrl = url;
    const urlOption = { url, method: method.toUpperCase() };
    const params = omitBy(data, (item) => item === undefined || item === null);
    if (/[GET|POST|PUT|DELETE|PATCH|HEAD] /.test(realUrl)) {
        urlOption.method = `${(/^.*? /.exec(url) || [])[0]}`.replace(' ', '');
        realUrl = realUrl.replace(/^.*? /, '');
    }
    const apiDomains = domains || this.domains || {};
    // url中不存在 '//' 匹配
    if (!/\/\//.test(realUrl)) {
        const urlPrefix = apiDomains[domain];
        if (!urlPrefix) {
            log.error('request.getUrlByOption 解析出错', option);
        }
        realUrl = `${urlPrefix}/${realUrl}`;
    }
    // 存在模版标记 tag
    if (/\{/.test(realUrl)) {
        realUrl = filter(realUrl, data);
    }
    if (urlOption.method === 'GET' && !isEmpty(data)) {
        const queryParams = omitBy(params, (item) => item === 'undefined' || item === '');
        realUrl += `${realUrl.indexOf('?') === -1 ? '?' : '&'}${qsstringify(queryParams)}`;
    }
    urlOption.url = realUrl;
    return urlOption;
}
// 使用 class 能够更容易重写 request 的一些回调值
export class Request {
    constructor(config) {
        this.domains = {};
        this.setConfig(config);
    }
    setConfig(config) {
        const { domains = {}, isRelease } = config || {};
        this.domains = domains;
        this.isRelease = isRelease;
    }
    // eslint-disable-next-line
    request(option) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: params, url = '', api } = option;
            let parsedOption = option;
            parsedOption.api = api || url;
            if (!option.api) {
                log.error('request option.api 不存在', option);
                return;
            }
            const query = getQuery('', option.url);
            if (query) {
                // eslint-disable-next-line
                parsedOption.url = url.split('?')[0];
                parsedOption.data = Object.assign(Object.assign({}, query), params);
            }
            if (this.mockSourceCtrl) {
                parsedOption = this.mockSourceCtrl(parsedOption);
            }
            const unionOption = Object.assign(Object.assign({}, parsedOption), getFetchOption.call(this, parsedOption));
            // 命中缓存 直接返回
            const cachedResponse = cacheSourceCtrl('get', unionOption);
            if (cachedResponse) {
                return cachedResponse;
            }
            // mock数据拦截
            const mockSource = yield mockSourceCtrl(unionOption);
            if (mockSource !== 'none') {
                cacheSourceCtrl('set', unionOption, mockSource);
                return mockSource;
            }
            const result = yield fetchSourceCtrl.call(this, unionOption);
            cacheSourceCtrl('set', unionOption, result);
            log.log('apiSource', unionOption.url, result, unionOption);
            return result;
        });
    }
}
