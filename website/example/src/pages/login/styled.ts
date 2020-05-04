import { css, DefaultTheme } from 'styled-components'

import { inline } from '@core/styled/utils'

export default ({ colors }: DefaultTheme) => css`
  .login-wrapper {
    width: 450px;
    margin: 12% auto 0;
    background-color: ${colors.layoutHeaderBg};
  }

  .login-title {
    margin: 0 0 15px 0px;
    font-size: 30px;
    text-align: center;

    img {
      ${inline()};
      width: 50px;
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

  .code-img {
    height: 34px;
    cursor: pointer;
  }
`
