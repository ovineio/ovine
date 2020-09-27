import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Amis } from '@core/components/amis/schema'

// import Layout from '@/components/layout'
import Attacher from '@/components/attacher'

const Wrap = styled.div`
  position: relative;
  width: 500px;
  margin: 50px auto 0;
`

export default () => {
  useEffect(() => {}, [])

  const schema = {
    type: 'page',
    className: 'editor-node page-1',
    $dataId: 'page-1',
    body: {
      type: 'card',
      $dataId: 'card-3',
      className: 'editor-node card-1',
      header: {
        className: 'editor-node header-1',
        title: '标题1',
        subTitle: '副标题',
        description: '这是一段描述',
        avatarClassName: 'pull-left thumb-md avatar b-3x m-r',
        avatar:
          'http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg',
      },
      body: {
        className: 'editor-node card-body-1',
      },
      actions: [
        {
          type: 'button',
          $dataId: 'button-1',
          className: 'editor-node button-1',
          label: '编辑',
          actionType: 'dialog',
          dialog: {
            title: '编辑',
            body: '你正在编辑该卡片',
          },
        },
        {
          type: 'button',
          className: 'editor-node button-2',
          label: '删除',
          actionType: 'dialog',
          dialog: {
            title: '提示',
            body: '你删掉了该卡片',
          },
        },
      ],
    },
  }

  return (
    <Wrap>
      <div id="editor-preview">
        <Amis schema={schema} />
      </div>
      <Attacher />
    </Wrap>
  )
}
