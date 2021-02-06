import styled from 'styled-components'

export const NoFields = styled.div`
  text-align: center;
  padding: 10px 0 15px;
  border-radius: 0 0 4px 4px;

  p {
    margin: 0;
    svg {
      width: 60px;
      height: 60px;
      margin: auto;
    }
  }

  div {
    color: #3590dc;
    &:hover {
      color: #145286;
    }
  }

  .anticon {
    padding-right: 5px;
  }
`

export const NoSettingItem = styled.div`
  text-align: center;
  padding: 60px 0 0;
  border-radius: 0 0 4px 4px;
  fill: #94959f;
  p {
    margin-bottom: 8px;
    svg {
      width: 60px;
      height: 60px;
      margin: auto;
    }
  }

  div {
    color: #3590dc;
    &:hover {
      color: #145286;
    }
  }

  .anticon {
    padding-right: 5px;
  }
`
