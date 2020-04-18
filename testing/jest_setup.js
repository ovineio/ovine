import $ from 'jquery' // eslint-disable-line

global.$ = $
global.jQuery = $

global.console.warn = jest.fn() // ignore lib warning

jest.mock('whatwg-fetch', () => {
  return {
    fetch: (_, { data }) =>
      new Promise((resolve, reject) => {
        const { withError, expectRes = {} } = data || {}
        if (withError) {
          reject(new Error('mockRequestError'))
        }
        resolve({
          json: jest.fn().mockResolvedValue(expectRes),
        })
      }),
  }
})
