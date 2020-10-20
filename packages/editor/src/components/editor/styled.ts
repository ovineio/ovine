import styled, { css } from 'styled-components'

export const StyledEditor = styled.div`
  .ae-Main {
    background: #eaeaea;
  }

  .ae-Breadcrumb {
    height: 25px;
    padding: 10px 0 0 14px;
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
        border-right: 1px solid rgb(219 219 219);
      }
    }
  }

  ${({ theme: { ns } }) => css`
    .ae-Editor {
      .${ns}ContextMenu {
        &-list > li {
          &:nth-last-child(2),
          &:nth-last-child(1) {
            display: none;
          }
        }
      }
    }

    .ae-Settings-tabs > {
      .${ns}Tabs-links {
        border-right: 1px solid rgb(219, 219, 219);
        background: #fff;
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
