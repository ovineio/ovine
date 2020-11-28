/**
 * 完整测试 request 所有参数 与 预期功能
 */

import { Request } from '../request'

const jestMockApi = 'jestMockApi'
const mockRequestError = 'mockRequestError'

let reqIns = new Request()

const domains = {
  api: 'https://mock-api.com',
  apiV2: 'https://mock-api-v2.com',
}

beforeEach(() => {
  reqIns = new Request()
  reqIns.setConfig({
    domains,
  })
})

describe('request hooks order. ', () => {
  test('instance hooks with success order.', async () => {
    const orders = []

    reqIns.onPreRequest = (o) => {
      orders.push(0)
      return o
    }
    reqIns.onRequest = (o) => {
      orders.push(1)
      return o
    }
    reqIns.onSuccess = (o) => {
      orders.push(2)
      return o
    }
    // should not invoke
    reqIns.onError = (o) => {
      orders.push(22)
      return o
    }
    reqIns.onFinish = (o) => {
      orders.push(3)
      return o
    }

    await reqIns.request({
      api: jestMockApi,
    })

    expect(orders.join(',')).toEqual('0,1,2,3')
  })

  test('instance hooks with error order.', async () => {
    const orders = []

    reqIns.onPreRequest = (o) => {
      orders.push(0)
      return o
    }
    reqIns.onRequest = (o) => {
      orders.push(1)
      return o
    }
    reqIns.onError = (o) => {
      orders.push(2)
      return o
    }
    // should not invoke
    reqIns.onSuccess = (o) => {
      orders.push(22)
      return o
    }
    reqIns.onFinish = (o) => {
      orders.push(3)
      return o
    }

    await reqIns
      .request({
        api: jestMockApi,
        data: {
          withError: true,
        },
      })
      .catch(({ error }) => {
        expect(error.message).toEqual(mockRequestError)
      })

    expect(orders.join(',')).toEqual('0,1,2,3')
  })

  test('option hooks with success order.', async () => {
    const orders = []

    await reqIns.request({
      api: jestMockApi,
      onRequest: (o) => {
        orders.push(0)
        return o
      },
      onSuccess: (o) => {
        orders.push(1)
        return o
      },
      // should not invoke
      onError: () => {
        orders.push(11)
        return false
      },
    })

    expect(orders.join(',')).toEqual('0,1')
  })

  test('option hooks with error order.', async () => {
    const orders = []

    await reqIns
      .request({
        api: jestMockApi,
        data: {
          withError: true,
        },
        onRequest: (o) => {
          orders.push(0)
          return o
        },
        onError: () => {
          orders.push(1)
        },
        onSuccess: (o) => {
          // should not invoke
          orders.push(11)
          return o
        },
      })
      .catch(({ error }) => {
        expect(error.message).toEqual(mockRequestError)
      })

    expect(orders.join(',')).toEqual('0,1')
  })

  test('instance and option hooks together with success order.', async () => {
    const orders = []

    reqIns.onPreRequest = (o) => {
      orders.push(0)
      return o
    }
    reqIns.onRequest = (o) => {
      orders.push(1)
      return o
    }
    reqIns.onSuccess = (o) => {
      orders.push(3)
      return o
    }
    // should not invoke
    reqIns.onError = (o) => {
      orders.push(33)
      return o
    }
    reqIns.onFinish = (o) => {
      orders.push(5)
      return o
    }

    await reqIns.request({
      api: jestMockApi,
      onRequest: (o) => {
        orders.push(2)
        return o
      },
      onSuccess: (o) => {
        orders.push(4)
        return o
      },
      // should not invoke
      onError: () => {
        orders.push(44)
        return false
      },
    })

    expect(orders.join(',')).toEqual('0,1,2,3,4,5')
  })

  test('instance and option hooks together with error order.', async () => {
    let orders = []

    reqIns.onPreRequest = (o) => {
      orders.push(0)
      return o
    }
    reqIns.onRequest = (o) => {
      orders.push(1)
      return o
    }
    reqIns.onError = () => {
      orders.push(4)
    }
    // should not invoke
    reqIns.onSuccess = (o) => {
      orders.push(44)
      return o
    }
    reqIns.onFinish = (o) => {
      orders.push(5)
      return o
    }

    const baseOptions = {
      api: jestMockApi,
      data: {
        withError: true,
      },
      onRequest: (o) => {
        orders.push(2)
        return o
      },
      onError: () => {
        orders.push(3)
      },
      onSuccess: (o) => {
        orders.push(33)
        return o
      },
    }

    await reqIns.request(baseOptions).catch(({ error }) => {
      expect(error.message).toEqual(mockRequestError)
    })

    expect(orders.join(',')).toEqual('0,1,2,3,4,5')

    orders = []
    await reqIns
      .request({
        ...baseOptions,
        onError: () => {
          // when option onError returned False, instance.onError will not invoke
          orders.push(3)
          return false
        },
      })
      .catch(({ error }) => {
        expect(error.message).toEqual(mockRequestError)
      })

    expect(orders.join(',')).toEqual('0,1,2,3,5')
  })
})

// describe('request occur exceptions.', () => {

// })

// describe('getUrlByOption utils.', () => {

// })

describe('request mock features. ', () => {
  test('request option "mockSource" for object.', () => {
    reqIns.setConfig({
      domains,
      isMock: true,
    })

    return reqIns
      .request<{ test: number }>({
        api: jestMockApi,
        mockSource: { test: 1 },
      })
      .then((source) => {
        expect(source.data.test).toBe(1)
      })
  })
})
