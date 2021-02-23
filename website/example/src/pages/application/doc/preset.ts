const tranProp = (items) => {
  return items.map((i) => {
    const { child: children, ...rest } = i
    if (children && children.length) {
      return {
        children: tranProp(children),
        ...rest,
      }
    }
    return rest
  })
}

export default {
  limits: {
    $page: {
      label: '查看列表',
    },
    add: {
      label: '添加',
    },
    edit: {
      label: '编辑',
    },
    del: {
      label: '删除',
    },
  },
  apis: {
    list: {
      url: 'GET ovapi/document/item',
      limits: '$page',
      onSuccess: (source) => {
        const items = source.data
        source.data = { options: tranProp(items) }
        return source
      },
      // // 测试字符串回调
      // onPreRequest: `
      //     const { dateRange } = option.data
      //     if (dateRange) {
      //       const arr = dateRange.split('%2C')
      //       option.data = {
      //         ...option.data,
      //         startDate: arr[0],
      //         endDate: arr[1],
      //       }
      //     }
      //     return option
      //  `,
    },
    add: {
      url: 'POST ovapi/document/item',
      limits: 'add',
    },
    edit: {
      url: 'PUT ovapi/document/item/$id',
      limits: 'edit',
    },
    del: {
      url: 'DELETE ovapi/document/item/$id',
      limits: 'del',
    },
  },
}
