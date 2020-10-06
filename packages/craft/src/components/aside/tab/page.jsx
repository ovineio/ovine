import React from 'react'
import { observer } from 'mobx-react'

import { Amis } from '@core/components/amis/schema'

import Tree from '../tree'
import Nav from '../nav'
import Indicator from '../indicator'

import { StyledPage } from './styled'

export default observer(() => {
  const schema = {
    type: 'container',
    body: [
      {
        type: 'collapse',
        title: '容器模版',
        body: {
          component: Indicator,
        },
      },
      {
        type: 'collapse',
        title: '可编辑元素',
        body: {
          component: () => <Nav />,
        },
      },
      {
        type: 'collapse',
        title: '节点导航',
        body: {
          component: (props) => <Tree {...props} />,
        },
      },
    ],
  }

  return (
    <StyledPage>
      <Amis schema={schema} />
    </StyledPage>
  )
})
