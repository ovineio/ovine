import { PagePreset } from '~/routes/types'

const prest: PagePreset = {
  limits: {
    $page: {
      label: '访问Dashboard',
    },
    target: {
      label: '指标数据',
    },
  },
  apis: {
    moneyChart: {
      url: 'GET api/v1/money_chart',
      mock: true,
      limits: 'target',
      // expired: 3000,
    },
    visitedChart: {
      url: 'GET api/v1/visited_chart',
      mock: true,
      limits: 'target',
      // expired: 3000,
    },
    adCompareChart: {
      url: 'GET api/v1/ad_compare_chart',
      limits: 'target',
      mock: true,
      // expired: 3000,
    },
    chargeChart: {
      url: 'GET api/v1/charge_chart',
      limits: 'target',
      mock: true,
      // expired: 3000,
    },
    adMoreData: {
      url: 'GET api/v1/ad_more_chart',
      mock: true,
      // expired: 3000,
    },
    adAreaChart: {
      url: 'GET api/v1/ad_area_chart',
      mock: true,
      // expired: 3000,
    },
    rainChart: {
      url: 'GET api/v1/rain_chart',
      mock: true,
      data: {
        keywords: '${keywords}',
        range: '${daterange}',
      },
      // expired: 3000,
    },
    indexChart: {
      url: 'GET api/v1/index_chart',
      mock: true,
      // expired: 3000,
    },
    funnelChart: {
      url: 'GET api/v1/funnel_chart',
      mock: true,
      // expired: 3000,
    },
    radarChart: {
      url: 'GET api/v1/radar_chart',
      mock: true,
      // expired: 3000,
    },
  },
}

export default prest
