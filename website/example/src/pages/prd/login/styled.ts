import styled from 'styled-components'

export const LoginPage = styled.div`
  padding: 7rem 0;

  p {
    color: darken(#ccc, 10%);
    font-weight: 300;
  }
  a {
    transition: 0.3s all ease;
    &:hover {
      text-decoration: none !important;
    }
  }

  a {
    color: #888;
    text-decoration: underline;
  }
  h2 {
    font-size: 20px;
  }

  .brand {
    display: flex;
    align-items: flex-start;
    padding-top: 0;
    padding-bottom: 0;

    img {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      padding: 6px;
      background-color: var(--primary);
    }
  }

  .contents {
    width: 50%;
  }
  .form-group {
    position: relative;
    label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      transition: 0.3s all ease;
      font-size: 14px;
      display: block;
      margin-bottom: 0;
      color: darken(#ccc, 10%);
    }

    input {
      background: transparent;
      border-bottom: 1px solid #ccc;
    }

    &.first {
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
    }
    &.last {
      // border-bottom: 1px solid #efefef;
      border-bottom-left-radius: 7px;
      border-bottom-right-radius: 7px;
    }
    &.focus {
      background: $white;
    }
    &.field--not-empty {
      label {
        margin-top: -25px;
      }
    }
  }
  .form-control {
    border: none;
    padding: 0;
    font-size: 20px;
    border-radius: 0;
    &:active,
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
  .bg {
    background-size: cover;
    background-position: center;
  }
  .btn {
    height: 54px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .forgot-pass {
    position: relative;
    top: 2px;
    font-size: 14px;
  }

  .error-tip {
    position: absolute;
    font-size: 12px;
    top: 50px;
    line-height: 28px;
    color: var(--danger);
  }

  .control {
    display: block;
    position: relative;
    padding-left: 30px;
    margin-bottom: 15px;
    cursor: pointer;
    font-size: 14px;
    .caption {
      position: relative;
      top: 0.2rem;
      color: #888;
    }
  }
  .control input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  .control__indicator {
    position: absolute;
    top: 2px;
    left: 0;
    height: 20px;
    width: 20px;
    background: #e6e6e6;
    border-radius: 4px;
  }
  .control--radio .control__indicator {
    border-radius: 50%;
  }
  .control:hover input ~ .control__indicator,
  .control input:focus ~ .control__indicator {
    background: #ccc;
  }
  .control input:checked ~ .control__indicator {
    background: var(--primary);
  }
  .control:hover input:not([disabled]):checked ~ .control__indicator,
  .control input:checked:focus ~ .control__indicator {
    background: var(--primary);
  }
  .control input:disabled ~ .control__indicator {
    background: #e6e6e6;
    opacity: 0.9;
    pointer-events: none;
  }
  .control__indicator:before {
    position: absolute;
    display: none;
    font-size: 12px;
    transition: 0.3s all ease;
  }
  .control input:checked ~ .control__indicator:before {
    display: block;
    color: #fff;
  }
  .control--checkbox .control__indicator:before {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .control--checkbox input:disabled ~ .control__indicator:before {
    border-color: #7b7b7b;
  }
  .control--checkbox input:disabled:checked ~ .control__indicator {
    background-color: #7e0cf5;
    opacity: 0.2;
  }
`
