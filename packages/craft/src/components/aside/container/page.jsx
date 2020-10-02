import React from 'react'
import styled from 'styled-components'

import { Container, Vertical, Horizontal, Corner } from './common'

export default () => {
  return (
    <Container title="页面模版">
      <StyledPage>
        <div className="part-aside">
          <Corner>侧边栏</Corner>
          <Vertical className="center" />
        </div>
        <div className="part-body">
          <div className="part-toolbar">
            <Corner>工具栏</Corner>
            <Horizontal className="center" />
          </div>
          <div className="part-content">
            <Corner>内容</Corner>
            <Vertical className="center" />
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
