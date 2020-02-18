import { RtSchema } from '~/components/amis/schema/types'

import * as reqSucHooks from './req'
import { dashboardCss } from './styled'

const targetCards = [
  {
    title: '总销售额',
    api: {
      $preset: 'apis.moneyChart',
      onSuccess: reqSucHooks.onMoneyChartSuc,
    },
    intro: '总销售额就是当月1号到月底最后一天，售出货物总利润。',
  },
  {
    title: '访问量',
    api: {
      $preset: 'apis.visitedChart',
      onSuccess: reqSucHooks.onVisitedChartSuc,
    },
    intro: '所有平台访到本产品的次数。',
  },
  {
    title: '交易数据',
    api: {
      $preset: 'apis.chargeChart',
      onSuccess: reqSucHooks.onChargeChartSuc,
    },
    intro: '所有平台用户，产生交易的对比。',
  },
  {
    title: '运营活动效果',
    api: {
      $preset: 'apis.adCompareChart',
      onSuccess: reqSucHooks.onAdCompareChartSuc,
    },
    intro: '营销广告的投入与所获的收入的对比。',
  },
]

const chartCards = [
  {
    title: '本周业绩指标',
    api: {
      $preset: 'apis.indexChart',
      onSuccess: reqSucHooks.onIndexChartSuc,
    },
  },
  {
    title: '订单成交漏斗',
    api: {
      $preset: 'apis.funnelChart',
      onSuccess: reqSucHooks.onFunnelChartSuc,
    },
  },
  {
    title: '营销雷达分析',
    api: {
      $preset: 'apis.radarChart',
      onSuccess: reqSucHooks.onRadarChartSuc,
    },
  },
]

export const schema: RtSchema = {
  type: 'page',
  css: dashboardCss,
  body: [
    {
      type: 'grid',
      className: 'dash-grid',
      limits: 'target',
      columns: renderTargetCards(targetCards),
    },
    {
      type: 'grid',
      className: 'dash-grid',
      columns: renderChartCards(chartCards),
    },
    {
      type: 'tabs',
      mode: 'line',
      className: 'tabs-card',
      tabs: [
        {
          title: '降雨量',
          tab: {
            type: 'service',
            name: 'tab-rain',
            api: {
              $preset: 'apis.rainChart',
              onSuccess: reqSucHooks.onRainChartSuc,
            },
            body: {
              type: 'grid',
              columns: [
                {
                  lg: 12,
                  $preset: 'forms.tabRainFilter',
                },
                {
                  lg: 8,
                  type: 'chart',
                  className: 'rain-chart',
                  name: 'rain-chart',
                  height: 300,
                  source: '${chart}',
                },
                {
                  type: 'table',
                  lg: 4,
                  affixHeader: false,
                  columnsTogglable: false,
                  className: 'rain-table m-b-none',
                  source: '${table}',
                  columns: [
                    {
                      name: 'date',
                      label: '月分',
                      width: 80,
                    },
                    {
                      name: 'evaporation',
                      label: '蒸发量',
                    },
                    {
                      name: 'water',
                      label: '将水量',
                    },
                    {
                      name: 'avg_temperature',
                      label: '平均温度',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          title: '访问量',
          tab: {
            type: 'grid',
            columns: [
              {
                lg: 6,
                type: 'chart',
                className: 'rain-chart',
                api: '$preset.apis.adMoreData',
                height: 300,
              },
              {
                type: 'carousel',
                className: 'img-carousel r',
                height: '300',
                options: [
                  {
                    image:
                      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1581791136739&di=212cf6361c0fd38b9673f1d00e71bab6&imgtype=0&src=http%3A%2F%2Ffile03.16sucai.com%2F2016%2F10%2F1100%2F16sucai_p20161004055_0aa.JPG',
                  },
                  {
                    image:
                      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1581791136739&di=c1f63ec2c9913bef6fd1bd896662e4d2&imgtype=0&src=http%3A%2F%2Fimg1.juimg.com%2F160329%2F330865-16032Z9554074.jpg',
                  },
                  {
                    image:
                      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1581791136719&di=08f22276b38062ffda9eaccb8d7be865&imgtype=0&src=http%3A%2F%2Fimg.juimg.com%2Ftuku%2Fyulantu%2F111110%2F17529-1111100ZF933.jpg',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
  preset: {
    forms: {
      tabRainFilter: {
        type: 'form',
        title: '过滤条件',
        className: 'tab-filter',
        submitOnInit: true,
        wrapWithPanel: false,
        mode: 'inline',
        target: 'tab-rain',
        controls: [
          {
            type: 'date-range',
            label: '时间范围',
            name: 'daterange',
          },
          {
            type: 'text',
            label: '关键字',
            name: 'keywords',
            clearable: true,
          },
          { type: 'submit', label: '搜索' },
        ],
        actions: [],
      },
    },
  },
}

function renderTargetCards(cardInfos: any[]) {
  return cardInfos.map((info) => {
    const { title, api, intro, grid } = info
    const gridProps = {
      lg: 3,
      md: 6,
      sm: 6,
      xs: 12,
      ...grid,
    }
    return {
      type: 'service',
      className: 'target-card',
      ...gridProps,
      api,
      body: [
        {
          type: 'wrapper',
          className: 'card-info no-bg',
          body: [
            {
              type: 'html',
              html: ` <div>${title}</div><p>$origin.text</p>`,
            },
            {
              type: 'button',
              actionType: 'dialog',
              className: 'tip-icon',
              icon: 'fa fa-question-circle',
              level: 'link',
              dialog: {
                title: `指标说明【${title}】`,
                closeOnEsc: true,
                body: {
                  type: 'html',
                  html: intro,
                },
                actions: [],
              },
            },
          ],
        },
        {
          type: 'chart',
          className: 'card-chart',
          source: '${chart}',
        },
      ],
    }
  })
}

function renderChartCards(cardInfos: any[]) {
  return cardInfos.map((info) => {
    const { title, api, grid } = info
    const gridProps = {
      lg: 4,
      md: 4,
      sm: 6,
      xs: 12,
      ...grid,
    }
    return {
      type: 'service',
      className: 'target-card',
      ...gridProps,
      api,
      body: {
        type: 'wrapper',
        className: 'no-bg-c',
        body: [
          {
            type: 'html',
            html: `<div class="m-none">${title}</div>`,
          },
          {
            type: 'chart',
            source: '${chart}',
            height: 300,
          },
        ],
      },
    }
  })
}
