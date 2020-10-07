import React from 'react'
import styled from 'styled-components'

import { toggleSelector } from '@/components/selector'

import { Container, Vertical, Horizontal, Corner } from './common'

export default (props) => {
  const { schema } = props.info
  const { toolbar, body, aside } = schema || {}

  const showSelector = (key, label, event) => {
    const { type, tooltip } = event.currentTarget.dataset
    const selectorInfo = {
      key,
      type,
      isShow: true,
      label: `在${label}${tooltip}组件`,
    }
    toggleSelector(selectorInfo)
  }

  return (
    <Container>
      <StyledPage>
        <div className="part-aside">
          <Corner>侧边栏</Corner>
          <Vertical
            hasItem={!!aside}
            className="center"
            showSelector={(e) => showSelector('aside', '侧边栏', e)}
          />
        </div>
        <div className="part-body">
          <div className="part-toolbar">
            <Corner r="0">工具栏</Corner>
            <Horizontal
              hasItem={!!toolbar}
              className="center"
              showSelector={(e) => showSelector('toolbar', '工具栏', e)}
            />
          </div>
          <div className="part-content">
            <Corner>内容区</Corner>
            <Vertical
              hasItem={!!body}
              className="center"
              showSelector={(e) => showSelector('body', '内容区', e)}
            />
          </div>
        </div>
      </StyledPage>
    </Container>
  )
}

const StyledPage = styled.div`
  display: flex;
  height: 100px;
  .part {
    &-aside {
      flex: 0 0 auto;
      position: relative;
      width: 30%;
      border-right: 1px solid #dedede;
    }
    &-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    &-toolbar {
      flex: 0 0 auto;
      position: relative;
      height: 30px;
      border-bottom: 1px solid #dedede;
    }
    &-content {
      flex: 1;
      position: relative;
    }
  }
`
