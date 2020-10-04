import styled from 'styled-components'

export const StyledSelector = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .selector-title {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-bottom: 1px solid #d7d8d9;
    height: 40px;
    font-size: 14px;
    background-color: #ededed;

    p {
      margin: 0;
    }
  }
  .selector-input {
    flex: 0 0 auto;
    padding: 12px 8px;
    border-bottom: 1px solid #dedede;

    input {
      flex: 1;
      border: 0;
      background: transparent;
      outline: none;
      max-width: initial;
    }

    .input {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 6px 12px;
      border: 1px solid #dedede;
    }

    .fa-search {
      flex: 0;
      margin-left: 4px;
    }
  }

  .selector-empty {
    margin-top: 40px;
    text-align: center;
    .fa-chain-broken {
      font-size: 40px;
      display: block;
      margin-bottom: 10px;
    }
  }

  .selector-list {
    flex: 1;
    display: flex;
    overflow: auto;
  }
  .selector-nav {
    position: relative;
    display: block;
    overflow: auto;
    height: 100%;
    border-right: 1px solid #dedede;
    .title {
      display: block;
      width: 100px;
      margin: 0 12px 0 12px;
      padding: 8px 0;
      font-weight: bold;
      color: #2b2b2b;
      border-bottom: 1px solid #dedede;
      cursor: pointer;
      &.active {
        color: #4285f4;
      }
    }
    .item {
      display: block;
      padding: 4px 0 4px 24px;
      cursor: pointer;
      color: #666;
      &:hover {
        color: #4285f4;
      }
      &.active {
        color: #fff;
        background: #4285f4;
      }
    }
  }
  .selector-content {
    position: relative;
    overflow: auto;
    width: 365px;
    height: 100%;
    margin: 0 0 0 10px;
    padding-right: 8px;
    .title {
      margin: 8px 0 0;
      font-size: 18px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-top: 5px;
      padding: 4px;
      border: 1px solid #dedede;
      cursor: pointer;
      &:hover {
        background: rgba(66, 133, 244, 0.05);
      }
      &.active {
        border: 1px solid #4285f4;
        background: rgba(66, 133, 244, 0.05);
      }

      img {
        width: 100px;
        margin-right: 10px;
      }
      h6 {
        margin: 5px 0 5px;
      }
      p {
        margin: 0;
      }
    }
  }
`
