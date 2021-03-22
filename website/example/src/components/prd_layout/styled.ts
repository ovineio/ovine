import styled from 'styled-components'

export const PrdLayout = styled.div`
  background-color: #f5f6fa;
  min-height: 100%;

  & > .navbar-light {
    background-color: #fff;
  }

  & > .content {
    background-color: #fff;
  }

  .navbar {
    height: 60px;
    border-width: 0 0 1px 0;
    .nav-item {
      a {
        font-size: 15px;
        color: var(--text--loud-color);
        &:hover {
          color: var(--Nav-item-onActive-bg);
        }
        &.active {
          span {
            position: relative;
            color: var(--Button--info-onActive-border);
            &::after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 2px;
              left: 0;
              bottom: -21px;
              background: var(--Button--info-onActive-border);
            }
          }
        }
      }
    }
  }

  .navbar-brand {
    display: inline-flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;

    img {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      padding: 4px;
      background-color: var(--primary);
    }
  }
  .user-item {
    .dropdown-menu {
      left: auto;
      right: 0;
    }
  }

  .item-user-content {
    img {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 8px;
    }
    div {
      font-size: 15px;
    }
  }
`
