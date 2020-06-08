/* eslint-disable no-restricted-properties */
import { times } from 'lodash'

export default {
  'GET ovapi/stat/data': () => {
    return {
      data: {
        list: times(7, (i) => ({
          date: `2020-05-3${i}`,
          loginCount: 10 + i * 3,
          registerCount: 15 + i * 3 * Math.pow(-1, i),
          showCount: 30 + i * 2 * Math.pow(-1, i),
          showUserCount: 20 + i * 5,
          userCount: 100 - i * 6,
        })),
      },
    }
  },
}
