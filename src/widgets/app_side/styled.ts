import styled from 'styled-components'

import { inline, wh } from '@utils/styled'

export const StyledAppSide = styled.div`
  &.layui-side {
    width: 220px;
    top: 0;
    z-index: 1001;
    position: fixed;
  }

  .layui-logo {
    cursor: pointer;
    background-color: #23262e;
    width: 220px;
    line-height: 50px;
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

  .layui-side-scroll {
    width: 235px;
    box-sizing: border-box;
    padding-top: 50px;
  }

  .layui-nav-tree {
    width: 220px;
    cursor: pointer;
  }

  .layui-nav-item > a {
    padding-top: 8px;
    padding-bottom: 8px;
    .layui-icon {
      position: absolute;
      left: 20px;
    }
  }

  .layui-nav-child {
    .layui-nav-child {
      a {
        padding-left: 60px;
      }
      .layui-nav-child a {
        padding-left: 80px;
      }
    }
  }

  .layui-nav-item a {
    height: 40px;
    line-height: 40px;
    padding-left: 45px;
    padding-right: 30px;
  }
`
