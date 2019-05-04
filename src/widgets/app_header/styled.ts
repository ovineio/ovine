import styled from 'styled-components'

export const StyledAppHeader = styled.div`
  &.layui-header {
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    background-color: #fff;
    height: 50px;
    color: #333;
  }

  .layui-nav-item {
    line-height: 50px;
  }

  .layui-layout-left {
    color: #333;
    left: 220px;
    padding: 0 10px;

    .layui-icon {
      font-weight: bold;
    }

    .layui-nav-item {
      margin: 0 20px;
    }

    a {
      padding: 0;
    }
  }

  .layui-nav-more {
    border-top-color: #333;
  }

  .layui-nav {
    a {
      color: #444;
      &:hover {
        color: #333;
      }
    }
  }

  .layui-form {
    position: relative;
    input {
      height: 30px;
      padding-left: 12px;
      background-color: #efefef;
      border: none 0;
      color: #333;
      font-size: 12px;
      text-indent: 20px;
    }

    .layui-edge {
      display: none;
    }

    .layui-icon-search {
      position: absolute;
      top: 8px;
      left: 9px;
      color: #6f6f70;
      line-height: normal;
      z-index: 2;
    }

    .layui-form-select dl {
      top: 36px;
      background-color: rgba(255, 255, 255, 0.9);
    }
  }

  .layui-nav-bar {
    height: 2px;
    top: 0 !important;
    background-color: #333;
  }
`
