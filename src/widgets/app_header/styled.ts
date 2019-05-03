import styled from 'styled-components'
import { inline, wh } from '@utils/styled'

export const StyledAppHeader = styled.div`
  .layui-logo {
    cursor: pointer;
    img {
      ${wh(30, 30)};
      ${inline()};
    }
    p {
      font-weight: bold;
      font-size: 20px;
      margin-left: 5px;
      ${inline()};
    }
  }

  .layui-breadcrumb {
    line-height: 60px;
  }

  .layui-layout-right {
    .layui-nav {
      ${inline()};
    }
  }

  .layui-form {
    position: relative;
    ${inline()};
    input {
      height: 30px;
      padding-left: 12px;
      background-color: #424652;
      background-color: rgba(255, 255, 255, 0.05);
      border: none 0;
      color: #fff;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      text-indent: 20px;
    }

    .layui-edge {
      display: none;
    }

    .layui-icon-search {
      position: absolute;
      top: 7px;
      left: 9px;
      color: #6f6f70;
    }
  }
`
