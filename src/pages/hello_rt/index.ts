import { RtSchema } from '~/widgets/amis/schema/types'

export const schema: RtSchema = {
  type: 'page',
  title: 'Hello RtAdmin',
  subTitle: '文档及其基本使用手册',
  body: [
    {
      type: 'html',
      html: `
        <h4>文档正在加班加点编写中...</h4>
      `,
    },
    // { type: 'divider' },
  ],
}
