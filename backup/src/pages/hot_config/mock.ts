import { uuid } from 'amis/lib/utils/helper'
import times from 'lodash/times'

const getItem = (i: number) => ({
  id: i,
  key: uuid(),
  cat: 'test',
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  token: 'k64qsgk9k64qsgk9k64qsgk9k64qsgk9',
  update_at: '2020-02-03 10:00:00',
  create_at: '2020-02-03 10:00:00',
  ip: '',
})

export const mockSource: Req.MockSource = {
  'GET api/v1/hot_config': () => {
    return {
      data: {
        items: times(1, getItem),
        total: 1,
      },
    }
  },
}
