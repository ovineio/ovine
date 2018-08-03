/**
 * 工具方法
 */

import config from 'config';
import moment from 'moment';
import { stringify } from 'qs';
import { template, get, isArray, pick, isNaN, isFinite, trim } from 'lodash';

import { IS_URL } from '../constant/reg';

export function isUrl(path) {
  return IS_URL.test(path);
}

export function getApiMethod(api = '', options = {}) {
  if (options.method) {
    return options.method;
  }

  return get(trim(api).match(/^.* /), 0) || 'GET';
}

/**
 * 根据数据，参数获取正确的请求地址url
 * @param {String} api API地址
 * @param {Object} params 数据
 * @param {Object} options 各种参数
 */
export function getUrl(api, params = {}, options = {}) {
  if (!api) return;
  const { method = 'get', module = 'api', json = false } = options;

  let url = '';

  if (api.indexOf('http') !== 0) {
    const host = config.isMock ? '/mock' : config.domain[module];
    url = `${host}/${api}${json ? '.json' : ''}`;
  }

  if (api.indexOf('<%=') > -1) {
    url = template(api)(params);
  }

  // console.info('method->', method);

  if (String(method).toUpperCase() === 'GET') {
    url += `?${stringify(params)}`;
  }

  return url;
}

export function unqid(len = 6, radix = 60) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;

  if (len) {
    for (i = 0; i < len; i++) { // eslint-disable-line
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; // eslint-disable-line
    uuid[14] = '4';
    for (i = 0; i < 36; i++) { // eslint-disable-line
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

export function formatNumDec(number, length = 3, fix = 2) {
  return formatNum(numFixed(number, fix), length);
}

export function formatNum(num, length = 3, formater = ',') {
  let number = num;
  number = String(number || 0);
  const numArr = number.split('.') || ['', ''];

  const strAry = numArr[0].toString().split('');

  for (let i = strAry.length - 1; i >= 0; i -= length) {
    if (i !== strAry.length - 1 && i >= 0) {
      strAry.splice(i + 1, 0, formater);
    }
  }

  return strAry.join('') + (numArr[1] ? `.${numArr[1]}` : '');
}

export function numFixed(number, fix = 2) {
  if (isNaN(Number(number)) || !isFinite(Number(number))) {
    return 0;
  }
  return Number(number).toFixed(fix);
}

export function getter(srouce, filed) {
  let reslut = srouce;
  if (isArray(filed)) {
    reslut = pick(srouce, filed);
  } else if (typeof filed === 'string') {
    reslut = get(srouce, filed);
  }
  return reslut;
}

export function dvideNumber(source) {
  const result = (String(source).indexOf('.') !== -1) ? source.toLocaleString() :
    source.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return result;
}

export function formatStringByType(type, source, opts = {}) {
  let result;
  switch (type) {
    case 'Number.Int':
      result = parseInt(source, 10);
      break;
    case 'Number.Float':
      result = parseFloat(source).toFixed(opts.fixed || 2);
      break;
    case 'Number.Dvide':
      result = dvideNumber(source);
      break;
    case 'Number.Percent': // 百分比
      result = String(source).indexOf('%') ? source :
        `${parseFloat(source) * 100}%`;
      break;
    case 'Date': // HH:mm
      result = moment(source).format(opts.format || 'YYYY-MM-DD HH:mm:ss');
      break;
    case 'Date.Date': // YYYY-MM-DD
      result = moment(source).format('YYYY-MM-DD');
      break;
    case 'Date.Month': // YYYY-MM
      result = moment(source).format('YYYY-MM');
      break;
    case 'Date.Time': // HH:mm
      result = moment(source).format('HH:mm');
      break;
    default:
      result = source;
  }

  return String(result);
}

// 异步加载js,css 文件
export function loadFile(fileUrl) {
  let url = fileUrl;
  if (fileUrl.indexOf('http') === -1) {
    url = `${location.origin}/public/${url}`;
  }

  return new Promise((resolve, reject) => {
    try {
      let file;
      let $node;
      if (url.indexOf('.js') > -1) {
        file = document.createElement('script');
        $node = document.getElementsByTagName('script');
        file.type = 'text/javascript';
        file.async = true;
        file.src = url;
      } else if (url.indexOf('.css') > -1) {
        file = document.createElement('link');
        $node = document.getElementsByTagName('link');
        file.rel = 'stylesheet';
        file.type = 'text/css';
        file.href = url;
      }

      $node = $node[$node.length - 1] || $node[0];

      if (!file || !$node) {
        reject(new Error('no files'));
        return;
      }

      file.onload = () => {
        resolve();
      };

      $node.parentNode.insertBefore(file, $node);
    } catch (err) {
      reject(err);
    }
  });
}

export function loadFiles(urls) {
  return Promise.all(urls.map(url => loadFile(url)));
}

// 表格导出csv
export function export2csv(table) {
  let data = '\ufeff';
  for (let i = 0, row; row = table.rows[i]; i++) { // eslint-disable-line
    for (let j = 0, col; col = row.cells[j]; j++) { // eslint-disable-line
      data = `data${j ? ',' : ''} \t"${col.replace(/"/g, '""')}"`;
    }
    data = `${data}\r\n`;
  }
  return data;
}
