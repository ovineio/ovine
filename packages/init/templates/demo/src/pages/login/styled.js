import { css } from 'styled-components'

export default ({ name }) => css`
  .login-wrapper {
    position: relative;
    max-width: 450px;
    margin: 12% auto 0;
    background-color: ${name === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255, 255, 255, 0.9)'};
  }

  .login-title {
    margin: 0 0 15px 0px;
    font-size: 30px;
    text-align: center;
    white-space: nowrap;
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
    text-align: right !important;
  }

  .code-input {
    min-width: 10rem;
  }

  .code-img {
    box-sizing: content-box;
    height: 34px;
    margin-left: 10px;
    cursor: pointer;
  }
`
