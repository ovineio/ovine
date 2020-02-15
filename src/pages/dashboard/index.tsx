import { RtSchema } from '~/widgets/amis/schema/types'

import { dashboardCss } from './styled'

const targetCards = [
  {
    title: '总销售额',
    api: '$preset.apis.moneyChart',
    intro: '总销售额就是当月1号到月底最后一天，售出货物总利润。',
  },
  {
    title: '访问量',
    api: '$preset.apis.visitedChart',
    intro: '所有平台访到本产品的次数。',
  },
  {
    title: '交易数据',
    api: '$preset.apis.chargeChart',
    intro: '所有平台用户，产生交易的对比。',
  },
  {
    title: '运营活动效果',
    api: '$preset.apis.adCompareChart',
    intro: '营销广告的投入与所获的收入的对比。',
  },
]

export const schema: RtSchema = {
  type: 'page',
  css: dashboardCss,
  body: [
    {
      type: 'grid',
      className: 'dash-grid',
      columns: renderTargetCards(targetCards),
    },
    {
      type: 'grid',
      className: 'dash-grid',
      columns: [
        {
          type: 'wrapper',
          lg: 4,
          body: [
            {
              type: 'html',
              html: '<h5 class="m-none">本周业绩指标</h5>',
            },
            {
              type: 'chart',
              api: '$preset.apis.indexChart',
              height: 300,
            },
          ],
        },
        {
          type: 'wrapper',
          lg: 4,
          body: [
            {
              type: 'html',
              html: '<h5 class="m-none">订单成交漏斗</h5>',
            },
            {
              type: 'chart',
              api: '$preset.apis.funnelChart',
              height: 300,
            },
          ],
        },
        {
          type: 'wrapper',
          lg: 4,
          body: [
            {
              type: 'html',
              html: '<h5 class="m-none">营销雷达分析</h5>',
            },
            {
              type: 'chart',
              api: '$preset.apis.radarChart',
              height: 300,
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      mode: 'line',
      className: 'tabs-card',
      tabs: [
        {
          title: '降雨量',
          tab: {
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
                api: '$preset.apis.rainChart',
                name: 'rain-chart',
                height: 300,
              },
              {
                type: 'table',
                lg: 4,
                affixHeader: false,
                columnsTogglable: false,
                className: 'm-b-none',
                columns: [
                  {
                    name: 'date',
                    label: '日期',
                  },
                  {
                    name: 'ads',
                    label: '蒸发量',
                  },
                  {
                    name: 'version',
                    label: '将水量',
                  },
                  {
                    name: 'browser',
                    label: '平均温度',
                  },
                ],
              },
            ],
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
                className: 'img-carousel',
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
        target: 'rain-chart',
        submitOnInit: true,
        wrapWithPanel: false,
        mode: 'inline',
        controls: [
          {
            type: 'date',
            label: '开始日期',
            name: 'starttime',
            value: '-8days',
            maxDate: '${endtime}',
          },
          {
            type: 'date',
            label: '结束日期',
            name: 'endtime',
            value: '-1days',
            minDate: '${starttime}',
          },
          {
            type: 'text',
            label: '关键字',
            name: 'name',
            addOn: {
              type: 'submit',
              label: '搜索',
            },
          },
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
          className: 'card-info',
          body: [
            {
              type: 'html',
              html: ` <h6>${title}</h6><p>$cardData.text</p>`,
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
          api,
        },
      ],
    }
  })
}
