import { uuid } from 'amis/lib/utils/helper'
import times from 'lodash/times'

import { MockSource } from '~/core/request'

const getItem = (i: number) => ({
  id: i,
  username: uuid(),
  nick_name: '昵称你好爱上',
  avatar: 'http://img0.imgtn.bdimg.com/it/u=2939704571,4273557359&fm=26&gp=0.jpg',
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  token: 'k64qsgk9k64qsgk9k64qsgk9k64qsgk9',
  update_at: '2020-02-03 10:00:00',
  create_at: '2020-02-03 10:00:00',
  ip: '',
})

export const mockSource: MockSource = {
  'GET api/v1/adm_user': () => {
    return {
      data: {
        items: times(30, getItem),
        total: 30,
      },
    }
  },
}
