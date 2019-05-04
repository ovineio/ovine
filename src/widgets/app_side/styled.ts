import styled from 'styled-components'
import { inline, wh } from '@utils/styled'

export const StyledAppSide = styled.div`
  &.layui-side {
    width: 220px;
    top: 0;
    z-index: 1001;
    position: fixed;
  }

  .layui-side-scroll {
    top: 50px;
  }

  .layui-nav-tree {
    width: 220px;
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
`
