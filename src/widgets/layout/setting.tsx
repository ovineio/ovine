import React from 'react'

import '~/assets/styles/themes/default.css'

import { Schema } from '../amis/schema'

import { LayoutCommProps } from './common'

type Props = LayoutCommProps

const getSchema = (option: Props) => {
  return {
    type: 'wrapper',
    body: [
      {
        type: 'html',
        html: `<h5 class="login-title m-t-xs m-b-lg">系统设置</h5>`,
      },
      {
        type: 'form',
        mode: 'horizontal',
        horizontal: { left: 'col-sm-4', right: 'col-sm-8' },
        wrapWithPanel: false,
        controls: [
          {
            type: 'select',
            name: 'select',
            label: '选择主题',
            options: [
              {
                label: 'Option A',
                value: 'a',
              },
              {
                label: 'Option B',
                value: 'b',
              },
            ],
          },
        ],
      },
    ],
  }
}

export default (props: Props) => {
  return <Schema schema={getSchema(props)} />
}
