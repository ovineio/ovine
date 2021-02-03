import styled from 'styled-components'

export const NavTreeWrap = styled.div`
  flex: 0 0 230px;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`

export const NavNode = styled.div`
  &.expand {
    .node-content {
      max-height: 800px;
      border-bottom: 1px solid #e5e5e7;
    }

    .node-header {
      background: #dbebf9;
      .anticon-right {
        transform: rotate(90deg) translateX(2px);
      }
    }
  }

  .node-header {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 32px;
    font-size: 14px;
    border-bottom: 1px solid #e5e5e7;
    cursor: pointer;

    .anticon-right {
      transform: rotate(0) translateX(0);
      padding-right: 4px;
      transition: transform 0.25s;
    }
  }

  .node-content {
    max-height: 0;
    height: auto;
    overflow-y: hidden;
    transition: max-height 0.25s;
  }
`

export const NavField = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 10px 0 30px;
  cursor: pointer;
  &:first-child {
    margin-top: 10px;
  }
  &:last-child {
    margin-bottom: 5px;
  }
  &:hover {
    background-color: #e6f0f9;
  }

  &.active {
    background-color: #c1e1fe;
  }
`
