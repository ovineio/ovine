import styled from 'styled-components'

export const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const StyledBody = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`

export const StyledPreview = styled.div`
  height: 100%;
  overflow: auto;

  &.ae-Preview {
    &.in-pc {
      padding: 15px;
    }
    &.is-mobile {
      height: calc(100% - 80px);
      max-height: 812px;
      background: #ebebeb;
      & > .ae-Preview-inner {
        position: relative;
        margin: 18px 0;
        padding: 0;
        height: calc(100% - 36px);
        min-height: unset;
        background-color: #fff;
      }
    }
  }
`
