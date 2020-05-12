export default {
  limits: {
    $page: {
      label: '查看列表',
    },
  },
  apis: {
    list: {
      url: 'GET rtapi/system/log/item',
      limits: '$page',
    },
  },
}
