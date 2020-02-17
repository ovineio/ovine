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
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [10, 52, 200, 334, 390, 330, 220],
    text: '¥ 126,560',
  })
}

function getVisitedChart() {
  return mockResSuccess({
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [820, 1120, 901, 1020, 1308, 843, 1211],
    text: '1,219',
  })
}

function getChargeChart() {
  return mockResSuccess({
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    text: '¥ 126,560',
    series: {
      profit: [200, 170, 240, 244, 200, 220, 210],
      income: [320, 302, 341, 374, 390, 450, 420],
      cost: [-120, -132, -101, -134, -190, -230, -210],
    },
  })
}

function getAdCompareChart() {
  return mockResSuccess({
    series: [
      { value: 335, name: '直接访问' },
      { value: 310, name: '邮件营销' },
      { value: 274, name: '联盟广告' },
      { value: 235, name: '视频广告' },
      { value: 400, name: '搜索引擎' },
    ],
    text: '¥ 126,560',
  })
}

function getIndexChart() {
  return mockResSuccess({
    series: {
      finish: 66.6,
    },
  })
}

function getFunnelChart() {
  return mockResSuccess({
    series: {
      expect: [
        { value: 60, name: '访问' },
        { value: 40, name: '咨询' },
        { value: 20, name: '订单' },
        { value: 80, name: '点击' },
        { value: 100, name: '展现' },
      ],
      reality: [
        { value: 30, name: '访问' },
        { value: 10, name: '咨询' },
        { value: 5, name: '订单' },
        { value: 50, name: '点击' },
        { value: 80, name: '展现' },
      ],
    },
  })
}

function getRadarChart() {
  return mockResSuccess({
    indicator: [
      { name: '销售', max: 6500 },
      { name: '管理', max: 16000 },
      { name: '信息技术', max: 30000 },
      { name: '客服', max: 38000 },
      { name: '研发', max: 52000 },
      { name: '市场', max: 25000 },
    ],
    series: {
      budget: [4300, 10000, 28000, 35000, 50000, 19000],
      cost: [5000, 14000, 28000, 31000, 42000, 21000],
    },
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
    items: [
      {
        date: '2019年1月',
        water: 2.0,
        evaporation: 2.6,
        avg_temperature: 2.0,
      },
      {
        date: '2019年2月',
        water: 4.9,
        evaporation: 5.9,
        avg_temperature: 2.2,
      },
      {
        date: '2019年3月',
        water: 7.0,
        evaporation: 9.0,
        avg_temperature: 3.3,
      },
      {
        date: '2019年4月',
        water: 23.2,
        evaporation: 26.4,
        avg_temperature: 4.5,
      },
      {
        date: '2019年5月',
        water: 25.6,
        evaporation: 28.7,
        avg_temperature: 6.3,
      },
      {
        date: '2019年6月',
        water: 76.7,
        evaporation: 70.7,
        avg_temperature: 10.2,
      },
      {
        date: '2019年7月',
        water: 135.6,
        evaporation: 175.6,
        avg_temperature: 20.3,
      },
      {
        date: '2019年8月',
        water: 162.2,
        evaporation: 182.2,
        avg_temperature: 23.0,
      },
      {
        date: '2019年9月',
        water: 32.6,
        evaporation: 48.7,
        avg_temperature: 23.4,
      },
      {
        date: '2019年10月',
        water: 20.0,
        evaporation: 18.8,
        avg_temperature: 16.5,
      },
      {
        date: '2019年11月',
        water: 6.4,
        evaporation: 6.0,
        avg_temperature: 12.0,
      },
      {
        date: '2019年12月',
        water: 3.3,
        evaporation: 2.3,
        avg_temperature: 6.2,
      },
    ],
  })
}

export default mockSource
