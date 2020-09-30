import styled from 'styled-components'

export const StyledAside = styled.div`
  display: flex;
  flex: 0 0 auto;
  width: 220px;
  height: 100%;
  border-right: 1px solid #efefef;
  background: #fefefe;
`

export const StyledBar = styled.div`
  flex: 0 0 auto;
  width: 40px;
  padding-top: 20px;
  border-right: 1px solid #efefef;

  ul {
    padding: 0;
  }
  li {
    width: 100%;
    height: 40px;
    text-align: center;
    list-style: none;
    cursor: pointer;

    &.active {
      color: blue;
    }
  }
`

export const StyledContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const StyledPanel = styled.div`
  width: 100%;
`

export const StyledNodes = styled.div`
  width: 100%;
  border-top: 1px solid #efefef;
`
