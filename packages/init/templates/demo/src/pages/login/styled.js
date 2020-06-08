import { css } from 'styled-components'

export default ({ colors }) => css`
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
      width: 50px;
      display: inline-block;
      vertical-align: middle;
    }
    p {
      margin: 0;
      display: inline-block;
      vertical-align: middle;
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

  .cxd-Form-label {
    padding-left: 40px;
  }

  .code-img {
    height: 34px;
    cursor: pointer;
  }
`
