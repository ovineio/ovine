import { MockSource } from '~/core/request'

const store: any = {}

export const mockSource: MockSource = {
  'POST api/v1/login': (option) => {
    const { data } = option
    return {
      code: 0,
      data: {
        name: '萌新你好',
      },
    }
  },
}
