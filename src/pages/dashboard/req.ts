import { ReqSucHook } from '~/core/request'
import { getAppTheme } from '~/themes/utils'

const getChartColor = () => getAppTheme().colors.echart

export const onMoneyChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { xAxis = [], series = [] } = data

  return {
    origin: data,
    chart: {
      color: getChartColor(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '0%',
        top: '0%',
        containLabel: false,
      },
      xAxis: [
        {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: xAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          barCategoryGap: false,
          data: series,
        },
      ],
    },
  }
}

export const onVisitedChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { xAxis = [], series = [] } = data
  return {
    origin: data,
    chart: {
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
    },
  }
}

export const onChargeChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { xAxis = [], series = {} } = data
  return {
    origin: data,
    chart: {
      color: getChartColor(),
      grid: {
        left: '10%',
        right: '10%',
        bottom: '0%',
        top: '0%',
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },

      yAxis: [
        {
          type: 'value',
          show: false,
          boundaryGap: false,
        },
      ],
      xAxis: [
        {
          type: 'category',
          show: false,
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          data: xAxis,
        },
      ],
      series: [
        {
          name: '利润',
          type: 'bar',
          label: false,
          data: series.profit || [],
        },
        {
          name: '收入',
          type: 'bar',
          stack: '总量',
          label: false,
          data: series.income || [],
        },
        {
          name: '支出',
          type: 'bar',
          stack: '总量',
          label: false,
          data: series.cost || [],
        },
      ],
    },
  }
}

export const onAdCompareChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { series = [] } = data
  return {
    origin: data,
    chart: {
      color: getChartColor(),
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false,
      },
      xAxis: {
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        boundaryGap: false,
        show: false,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1],
        },
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          label: {
            position: 'outside',
            distanceToLabelLine: 0,
          },
          data: series.sort((a: any, b: any) => a.value - b.value),
          roseType: 'radius',
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: () => Math.random() * 200,
        },
      ],
    },
  }
}

export const onIndexChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { series = {} } = data
  return {
    origin: data,
    chart: {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          color: getChartColor(),

          name: '业务指标',
          type: 'gauge',
          radius: '80%',
          detail: { formatter: '{value}%' },
          data: [{ value: series.finish || 0, name: '本周完成清情况' }],
          title: {
            offsetCenter: [0, '70%'],
            fontSize: '14',
          },
          axisLine: {
            lineStyle: {
              width: 15,
            },
          },
          axisTick: {
            length: 5,
          },
          splitLine: {
            length: 12,
          },
        },
      ],
    },
  }
}

export const onFunnelChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { series = {} } = data
  return {
    origin: data,
    chart: {
      color: getChartColor(),
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%',
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false,
      },
      series: [
        {
          name: '预期',
          type: 'funnel',
          left: '10%',
          width: '80%',
          label: {
            formatter: '{b}预期',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            opacity: 0.7,
          },
          emphasis: {
            label: {
              position: 'inside',
              formatter: '{b}预期: {c}%',
            },
          },
          data: series.expect || [],
        },
        {
          name: '实际',
          type: 'funnel',
          left: '10%',
          width: '80%',
          maxSize: '80%',
          label: {
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
          },
          itemStyle: {
            opacity: 0.5,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              position: 'inside',
              formatter: '{b}实际: {c}%',
            },
          },
          data: series.reality || [],
        },
      ],
    },
  }
}

export const onRadarChartSuc: ReqSucHook = ({ data = {} }: any) => {
  const { indicator = [], series = {} } = data
  return {
    origin: data,
    chart: {
      color: getChartColor(),
      tooltip: {},
      radar: {
        radius: '55%',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5],
          },
        },
        indicator,
      },
      series: [
        {
          name: '预算 vs 开销',
          type: 'radar',
          data: [
            {
              value: series.budget || [],
              name: '预算分配',
            },
            {
              value: series.cost || [],
              name: '实际开销',
            },
          ],
        },
      ],
    },
  }
}

export const onRainChartSuc: ReqSucHook = ({ data = [] }: any) => {
  const { items: list = [] } = data

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
