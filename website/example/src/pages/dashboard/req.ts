import { last } from 'lodash'

import { app } from '@ovine/core/lib/app'

const getChartColor = () => app.theme.getTheme().colors.echart

const getAreaChart = (kpi: string, items: any[]) => {
  const xAxis = []
  const series = []

  items.forEach((i) => {
    xAxis.push(i.date)
    series.push(i[kpi])
  })

  return {
    color: getChartColor(),
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

export const onBarChartSuc: any = (source) => {
  const { items: list = [] } = source.data

  return {
    table: list,
    chart: {
      color: getChartColor(),
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
        data: ['蒸发量', '降水量', '平均温度'],
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
          name: '水量',
          show: false,
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value} ml',
          },
        },
        {
          type: 'value',
          name: '温度',
          show: false,
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} °C',
          },
        },
      ],
      series: [
        {
          name: '蒸发量',
          type: 'bar',
          data: list.map((i: any) => i.evaporation),
        },
        {
          name: '降水量',
          type: 'bar',
          data: list.map((i: any) => i.water),
        },
        {
          name: '平均温度',
          type: 'line',
          yAxisIndex: 1,
          data: list.map((i: any) => i.avg_temperature),
        },
      ],
    },
  }
}
