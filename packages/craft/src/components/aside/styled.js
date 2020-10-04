import styled from 'styled-components'

export const StyledAside = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 220px;
  height: 100%;
  border-right: 1px solid #efefef;
  background: #fefefe;

  .craft-aside-tab {
    width: 100%;
    border: 0;
    & > div {
      overflow: hidden;
      padding: 8px;
    }
    & > ul {
      width: 40px;
      a {
        padding: 5px 0;
      }
      i {
        display: block;
      }
    }
  }
`

export const StyledNodes = styled.div`
  width: 100%;
  border-top: 1px solid #efefef;
`
