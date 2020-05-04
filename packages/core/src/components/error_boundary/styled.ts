import styled from 'styled-components'

import { coreStatic } from '@/constants'

export const StyledErrorPage = styled.div`
  .inner {
    text-align: center;
  }
  .error-img {
    margin: 100px auto 20px;
    width: 190px;
    height: 120px;
    background-image: url(${`${coreStatic}/error.png`});
    background-size: cover;
    background-repeat: no-repeat;
    ${({ theme: { name } }) => ({
      opacity: name === 'dark' ? 0.5 : 1,
    })}
  }
  span {
    font-size: 16px;
    padding-right: 10px;
  }
`
