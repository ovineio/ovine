import * as reqHooks from './req'
import dashboardCss from './styled'

const targetCards = [
  {
    title: '总用户数',
    intro: '系统内管理员最多时的数量',
    kpi: 'userCount',
  },
  {
    title: '登录人数',
    intro: '每天登录系统的管理员人数',
    kpi: 'loginCount',
  },
  {
    title: '新增加人数',
    intro: '每天系统的新增加的管理员人数',
    kpi: 'registerCount',
  },
  {
    title: '系统总访问次数',
    intro: '每天系统的被访问的次数',
    kpi: 'showCount',
  },
]

export const schema = {
  type: 'page',
  css: dashboardCss,
  body: [
    {
      type: 'service',
      api: {
        $preset: 'apis.chart',
        onSuccess: reqHooks.onKpiChartSuc,
      },
      body: {
        type: 'grid',
        className: 'dash-grid',
        columns: renderTargetCards(targetCards),
      },
    },
    {
      type: 'tabs',
      mode: 'line',
      className: 'tabs-card',
      tabs: [
        {
          title: '访问量',
          tab: {
            type: 'service',
            name: 'tab-rain',
            api: {
              $preset: 'apis.chart',
              data: {
                startDate: '$dateRange.0',
                endDate: '$dateRange.1',
              },
              onSuccess: reqHooks.onBarChartSuc,
            },
            body: {
              type: 'grid',
              columns: [
                {
                  lg: 6,
                  type: 'grid',
                  columns: [
                    {
                      lg: 12,
                      $preset: 'forms.tabRainFilter',
                    },
                    {
                      lg: 12,
                      type: 'chart',
                      className: 'rain-chart',
                      name: 'rain-chart',
                      height: 295,
                      source: '${chart}',
                    },
                  ],
                },
                {
                  type: 'table',
                  lg: 6,
                  affixHeader: false,
                  columnsTogglable: false,
                  className: 'bar-table m-b-none',
                  source: '${table}',
                  columns: [
                    {
                      name: 'date',
                      label: '日期',
                      width: 100,
                    },
                    {
                      name: 'loginCount',
                      label: '登录人数',
                    },
                    {
                      name: 'registerCount',
                      label: '新增人数',
                    },
                    {
                      name: 'userCount',
                      label: '总用户数',
                    },
                    {
                      name: 'showCount',
                      label: '浏览次数',
                    },
                  ],
                },
              ],
            },
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
        submitOnInit: false,
        wrapWithPanel: false,
        mode: 'inline',
        target: 'tab-rain',
        actions: [],
        controls: [
          {
            type: 'date-range',
            label: '时间范围',
            name: 'dateRange',
            format: 'YYYY-MM-DD',
            joinValues: false,
          },
          { type: 'submit', label: '搜索' },
        ],
      },
    },
  },
}

function renderTargetCards(cardInfos: any[]) {
  return cardInfos.map((info) => {
    const { title, intro, grid, kpi } = info
    const gridProps = {
      lg: 3,
      md: 6,
      sm: 6,
      xs: 12,
      ...grid,
    }
    return {
      type: 'wrapper',
      className: 'target-card',
      ...gridProps,
      body: [
        {
          type: 'wrapper',
          className: 'card-info no-bg',
          body: [
            {
              type: 'tpl',
              tpl: ` <div>${title}</div><p><%= data?.${kpi}?.num || "0"%></p>`,
            },
            {
              type: 'html',
              html: `<i class="tip-icon fa fa-question-circle clickable" data-tooltip="${intro}" data-position="left"></i>`,
            },
          ],
        },
        {
          type: 'chart',
          className: 'card-chart',
          source: `\${${kpi}.chart}`,
        },
      ],
    }
  })
}
