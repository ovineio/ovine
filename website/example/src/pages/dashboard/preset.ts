/**
 * 页面预设值，本文件不要引入模块
 */
import {get }from 'lodash'
 import moment from 'moment'

import { PagePreset } from '@core/routes/types'

const prest: PagePreset = {
  // 页面需要用到的权限定义
  limits: {
    // 路由权限
    $page: {
      label: '访问Dashboard',
    },
  },
  apis: {
    chart: {
      url: 'GET ovapi/stat/data',
      onPreRequest: (opts) => {
        if (get(opts,'query.startDate') === '') {
          opts.data = {
            startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'), 
            endDate: moment().format('YYYY-MM-DD')
          }
        }
        return opts
      },
      limits: '$page',
    },
  },
}

export default prest
