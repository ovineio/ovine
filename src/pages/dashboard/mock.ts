import { MockSource } from '~/core/request'
import { mockResSuccess } from '~/utils/mock'

export const mockSource: MockSource = {
  'GET api/v1/money_chart': getMoneyChart,
  'GET api/v1/visited_chart': getVisitedChart,
  'GET api/v1/ad_compare_chart': getAdCompareChart,
  'GET api/v1/charge_chart': getChargeChart,
  'GET api/v1/ad_more_chart': getAdMoreChart,
  'GET api/v1/ad_area_chart': getAdLineArea,
  'GET api/v1/rain_chart': getRainChart,
  'GET api/v1/index_chart': getIndexChart,
  'GET api/v1/funnel_chart': getFunnelChart,
  'GET api/v1/radar_chart': getRadarChart,
}

function getMoneyChart() {
  return mockResSuccess({
    cardData: {
      text: '¥ 126,560',
    },
    color: ['#3398DB'],
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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  })
}

function getVisitedChart() {
  return mockResSuccess({
    cardData: {
      text: '1,123,123',
    },
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {},
      },
    ],
  })
}

function getAdCompareChart() {
  return mockResSuccess({
    cardData: {
      text: '1,123,123',
    },
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
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 274, name: '联盟广告' },
          { value: 235, name: '视频广告' },
          { value: 400, name: '搜索引擎' },
        ].sort((a, b) => a.value - b.value),
        roseType: 'radius',
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200,
      },
    ],
  })
}

function getIndexChart() {
  return mockResSuccess({
    cardData: {
      text: '1,123,123',
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: '业务指标',
        type: 'gauge',
        radius: '80%',
        detail: { formatter: '{value}%' },
        data: [{ value: 66.6, name: '本周完成清情况' }],
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
  })
}

function getFunnelChart() {
  return mockResSuccess({
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
        data: [
          { value: 60, name: '访问' },
          { value: 40, name: '咨询' },
          { value: 20, name: '订单' },
          { value: 80, name: '点击' },
          { value: 100, name: '展现' },
        ],
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
        data: [
          { value: 30, name: '访问' },
          { value: 10, name: '咨询' },
          { value: 5, name: '订单' },
          { value: 50, name: '点击' },
          { value: 80, name: '展现' },
        ],
      },
    ],
  })
}

function getRadarChart() {
  return mockResSuccess({
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
      indicator: [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客服', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '市场', max: 25000 },
      ],
    },
    series: [
      {
        name: '预算 vs 开销',
        type: 'radar',
        data: [
          {
            value: [4300, 10000, 28000, 35000, 50000, 19000],
            name: '预算分配',
          },
          {
            value: [5000, 14000, 28000, 31000, 42000, 21000],
            name: '实际开销',
          },
        ],
      },
    ],
  })
}

function getChargeChart() {
  return mockResSuccess({
    cardData: {
      text: '1,123,123',
    },
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    series: [
      {
        name: '利润',
        type: 'bar',
        label: false,
        data: [200, 170, 240, 244, 200, 220, 210],
      },
      {
        name: '收入',
        type: 'bar',
        stack: '总量',
        label: false,
        data: [320, 302, 341, 374, 390, 450, 420],
      },
      {
        name: '支出',
        type: 'bar',
        stack: '总量',
        label: false,
        data: [-120, -132, -101, -134, -190, -230, -210],
      },
    ],
  })
}

function getAdMoreChart() {
  return mockResSuccess({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '40%'],

        label: {
          position: 'inner',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 335, name: '直达', selected: true },
          { value: 679, name: '营销广告' },
          { value: 1548, name: '搜索引擎' },
        ],
      },
      {
        name: '访问来源',
        type: 'pie',
        radius: ['65%', '75%'],
        label: {
          formatter: '{b|{b}：}{c}  {per|{d}%}  ',
          rich: {
            hr: {
              borderColor: '#aaa',
              width: '100%',
              borderWidth: 0.5,
              height: 0,
            },
            b: {
              fontSize: 16,
              lineHeight: 33,
            },
            per: {
              color: '#eee',
              backgroundColor: '#334455',
              padding: [2, 4],
              borderRadius: 2,
            },
          },
        },
        data: [
          { value: 335, name: '直达' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 500, name: '百度' },
          { value: 251, name: '谷歌' },
          { value: 102, name: '其他' },
        ],
      },
    ],
  })
}

function getAdLineArea() {
  return mockResSuccess({
    title: {
      text: '堆叠区域图',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },

    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '邮件营销',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'top',
          },
        },
        areaStyle: {},
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  })
}

function getRainChart() {
  return mockResSuccess({
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
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
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
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: '降水量',
        type: 'bar',
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: '平均温度',
        type: 'line',
        yAxisIndex: 1,
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
      },
    ],
  })
}

export default mockSource
