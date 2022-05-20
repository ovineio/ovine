import { css } from 'styled-components'

export const asideCss = css`
  :root {
    --Layout-aside-width: 14.25rem;
  }
  .with-route-tabs .cxd-Layout {
    .navbar-brand-holder {
      background: transparent;
    }
  }
  .cxd-Layout {
    .cxd-Layout {
      &-header {
        background: transparent;
      }
    }
    &--folded {
      .brand-logo {
        display: none;
      }

      &-headerBar {
        background: #fff;
      }
      .cxd-AsideNav-subList {
        border-radius: 4px;
        background: url(https://static.igroupes.com/ovine_bg_cxd_menu_bg.jpg) !important;
        background-size: cover;
      }
    }
    &-brandBar {
      background: transparent;
    }
    &-headerBar {
      background: #fff;
    }

    &-asideWrap {
      backdrop-filter: blur(8px);
      background: rgba(0, 0, 0, 0.05);
    }
    &-aside {
      background: url(https://static.igroupes.com/ovine_bg_cxd_menu_bg.jpg);
      .cxd-AsideNav {
        &-subList {
          background: rgba(255, 255, 255, 0.1);
        }
        &-item {
          a {
            font-size: 0.85rem;
          }
          a:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            .cxd-AsideNav-itemIcon {
              color: #fff;
            }
          }
          &.is-active > a,
          &.is-active > a:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            font-weight: bold;
            backdrop-filter: blur(16px);
          }
        }
      }
    }
  }
`
