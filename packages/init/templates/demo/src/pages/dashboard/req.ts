/**
 * 图表展示请求的回调
 */

import { last, maxBy } from 'lodash'

const getAreaChart = (kpi: string, items: any[]) => {
  const xAxis = []
  const series = []

  items.forEach((i) => {
    xAxis.push(i.date)
    series.push(i[kpi])
  })

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '0%',
      top: '0%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: series,
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {},
      },
    ],
  }
}

export const onKpiChartSuc = (source) => {
  const { items } = source.data
  const curr: any = last(items) || {}

  source.data = {
    userCount: {
      num: curr.userCount || 0,
      chart: getAreaChart('userCount', items),
    },
    loginCount: {
      num: curr.loginCount || 0,
      chart: getAreaChart('loginCount', items),
    },
    registerCount: {
      num: curr.registerCount || 0,
      chart: getAreaChart('registerCount', items),
    },
    showCount: {
      num: curr.showCount || 0,
      chart: getAreaChart('showCount', items),
    },
  }

  return source
}

export const onBarChartSuc = (source) => {
  const { items: list = [] } = source.data
  const maxUser = !list.length ? 10 : maxBy(list, (i: any) => i.loginCount).loginCount + 20
  const maxCount = !list.length ? 10 : maxBy(list, (i: any) => i.showCount).showCount + 20

  source.data = {
    table: [...list].reverse(),
    chart: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {
        left: 10,
        data: ['登录人数', '新增人数', '浏览次数'],
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false,
      },
      xAxis: [
        {
          type: 'category',
          show: false,
          data: list.map((i: any) => i.date),
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '人数',
          show: false,
          min: 0,
          max: maxUser,
          interval: maxUser / 10,
          axisLabel: {
            formatter: '{value} 人',
          },
        },
        {
          type: 'value',
          name: '次数',
          show: false,
          min: 0,
          max: maxCount,
          interval: maxCount / 10,
          axisLabel: {
            formatter: '{value} 次',
          },
        },
      ],
      series: [
        {
          name: '登录人数',
          type: 'bar',
          data: list.map((i: any) => i.loginCount),
        },
        {
          name: '新增人数',
          type: 'bar',
          data: list.map((i: any) => i.registerCount),
        },
        {
          name: '浏览次数',
          type: 'line',
          yAxisIndex: 1,
          data: list.map((i: any) => i.showCount),
        },
      ],
    },
  }

  return source
}
