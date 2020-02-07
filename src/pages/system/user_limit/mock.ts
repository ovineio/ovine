import { uuid } from 'amis/lib/utils/helper'
import times from 'lodash/times'

const getItem = (i: number) => ({
  id: i,
  name: uuid(),
  remark:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  users: i !== 1 && 'k64qsgk9k64qsgk9k64qsgk9k64qsgk9',
  update_at: '2020-02-03 10:00:00',
  create_at: '2020-02-03 10:00:00',
  content: '',
})

export const mockSource = {
  'GET api/v1/adm_user_limit': () => {
    return {
      data: {
        items: times(30, getItem),
        total: 30,
      },
    }
  },
}
