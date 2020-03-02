import styled from 'styled-components'

export const StyledErrorPage = styled.div`
  .inner {
    text-align: center;
    & > div {
      margin: 100px auto 20px;
      width: 190px;
      height: 120px;
      background-image: url(${require('./error.png')});
      background-size: cover;
      background-repeat: no-repeat;
      ${({ theme: { name } }) => ({
        opacity: name === 'dark' ? 0.5 : 1,
      })}
    }
    p {
      font-size: 16px;
    }
    a {
      padding-left: 10px;
    }
  }
`
