import { createGlobalStyle, css } from 'styled-components'

const getThemeStyle = (ns: string) => {
  return css`
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
      .${ns}Remark-icon.icon-question {
        border: 0;
      }
      .${ns}Button--xs {
        min-width: auto;
      }
      /*
      .${ns}Remark:hover > .${ns}Remark-icon {
        color: #f38900;
        background-color: transparent;
      } */

      .${ns}ClassNamePicker-popover {
        height: 410px;
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
            display: block;
            color: rgb(108, 109, 110) !important;
            text-align: center;
            cursor: pointer;
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

    .${ns}Tooltip {
      .ae-RendererPreview {
        min-width: auto;
      }
    }

  `
}

export const GlobalEditorStyle = createGlobalStyle`
  .ae-Editor {
    .ae-Main {
      background: #eaeaea;
    }

    .ae-Breadcrumb {
      height: 28px;
      padding: 5px 0 5px 15px;
      line-height: none;
      box-shadow: none;
      background: transparent;
    }

    .ae-Preview {
      &::-webkit-scrollbar {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border: 2px solid #eaeaea;
      }
      padding: 15px;
    }
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

  /** editor 写死的主题 */
  .cxd-ClassNamePicker-popover {
    padding: 10px;
    width: 610px;
    max-height: 400px;
    overflow: auto;
  }

  .cxd-ClassNamePicker-popover.cxd-PopOver--leftBottomLeftTop {
    margin-top: 1px;
  }

  .cxd-ClassNamePicker-popover.cxd-PopOver--leftTopLeftBottom {
    margin-top: -1px;
  }

  .cxd-ClassNameControl-group {
    margin: 10px;
    display: inline-block;
    width: 265px;
  }

  .cxd-ClassNameControl-group.w2x {
    width: 550px;
  }

  .cxd-ClassNameControl-group .cxd-ClassNameControl-group {
    padding-left: 65px;
    margin: 0;
    display: block;
    width: auto;
  }

  .cxd-ClassNameControl-group .cxd-ClassNameControl-group:not(:last-child) {
    margin: 0 0 10px 0;
  }

  .cxd-ClassNameControl-group .cxd-ClassNameControl-group .cxd-ClassNameControl-groupLabel {
    float: left;
    border: none;
    padding-top: 5px;
    padding-bottom: 0;
    text-align: right;
    margin: 0 0 0 -60px;
    font-size: 12px;
  }

  .cxd-ClassNameControl-group .cxd-ButtonGroup + .cxd-ButtonGroup {
    margin-left: 5px;
  }

  .cxd-ClassNameControl-groupLabel {
    border-bottom: 0.0625rem solid #edeff1;
    display: block;
    padding-bottom: 5px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  ${({ theme: { ns } }: any) => getThemeStyle(ns)};
`
