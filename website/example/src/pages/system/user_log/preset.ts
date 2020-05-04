import mockSource from './mock'

export default {
  limits: {
    $page: {
      label: '查看列表',
    },
  },
  apis: {
    list: {
      mockSource,
      url: 'GET rtapi/system/log/item',
      limits: '$page',
    },
  },
}
