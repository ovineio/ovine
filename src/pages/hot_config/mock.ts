import times from 'lodash/times'

export const mockSource = {
  'GET api/v1/hot_config': () => {
    return {
      code: 0,
      data: {
        status: 0,
        data: times(30, (i) => {
          return {
            id: i,
          }
        }),
      },
    }
  },
}
