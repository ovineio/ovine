import styled from 'styled-components/macro'

import { inline } from '~/utils/styled'

export const StyledLogin = styled.div`
  .login-wrapper {
    width: 450px;
    margin: 12% auto 0;
  }

  .login-title {
    margin: 0 0 15px 0px;
    font-size: 30px;
    text-align: center;

    img {
      ${inline()};
      width: 30px;
    }
    p {
      ${inline()};
      margin: 0;
    }
  }

  .login-form {
    padding-top: 15px;

    .is-error {
      label {
        color: #58666e;
      }
    }
  }
`
