import styled, { css } from 'styled-components'

export const StyledEditor = styled.div`
  .ae-Main {
    background: #eaeaea;
  }
  .ae-Preview {
    &::-webkit-scrollbar {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border: 2px solid #eaeaea;
    }
  }

  .ae-Breadcrumb {
    height: 28px;
    padding: 5px 0 5px 15px;
    line-height: none;
    box-shadow: none;
    background: transparent;
  }

  .ae-Preview {
    padding: 15px;
  }

  .ae-Settings {
    box-shadow: none;
    .ae-Settings-tabs-content {
      & > .is-active {
        box-shadow: 2px 0 20px 0 rgba(0, 0, 0, 0.05);
        border-left: 1px solid rgb(219 219 219);
      }
    }
    .ae-LeftSettings-tabs {
      .ae-Settings-tabs-content {
        & > .is-active {
          border: 0;
          border-right: 1px solid rgb(219 219 219);
          box-shadow: 2px 0 20px 0 rgba(0, 0, 0, 0.05);
        }
      }
    }
  }

  ${({ theme: { ns } }) => css`
    .ae-Editor {
      ul {
        padding: 0;
      }
      .${ns}ContextMenu {
        &-list > li {
          &:nth-last-child(2),
          &:nth-last-child(1) {
            display: none;
          }
        }
      }
    }

    .ae-Settings-tabs {
      &.ae-LeftSettings-tabs {
        & > .${ns}Tabs-links {
          border: 0;
          border-right: 1px solid rgb(219, 219, 219);
        }
      }
      & .${ns}Tabs-content {
        border-width: 0;
      }

      & > .${ns}Tabs-links {
        background: #fff;
        border-left: 1px solid rgb(219, 219, 219);
        .${ns}Tabs-link {
          > a {
            color: rgb(108, 109, 110) !important;
            &:hover {
              background-color: rgb(247, 247, 247) !important;
            }
          }
          &.is-active > a {
            background-color: rgb(232, 232, 232) !important;
          }
        }
      }
    }
  `}
`
