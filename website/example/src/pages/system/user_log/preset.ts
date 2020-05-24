export default {
  limits: {
    $page: {
      label: '查看列表',
    },
  },
  apis: {
    list: {
      url: 'GET ovapi/system/log/item',
      limits: '$page',
    },
  },
}
