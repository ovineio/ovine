import styled, { css } from 'styled-components'

import { ellipsis, inline } from '~/utils/styled'

export const StyledLayout = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  ${({ theme: { ns } }) => css`
    .${ns}Layout--folded .app-layout-brand {
      height: 3.125rem;
      display: table-cell;
    }
    .${ns}Layout {
      height: 100%;
    }
  `}

  .mobile-menu {
    height: 100%;
  }

  .brand-logo {
    width: 22px;
  }

  .app-layout-brand {
    color: #fff;
    &:hover,
    &:active {
      color: #fff;
    }
  }

  .app-layout-body {
    position: relative;
    width: 100%;
    min-height: 100%;
  }

  .app-head-item {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`

export const PopupUserMenu = styled.div`
  ${({ theme: { colors } }) => css`
    li:hover {
      color: ${colors.linkHover};
    }
  `}
  ul {
    min-width: 100px;
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
    padding: 6px;
    cursor: pointer;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }
  }
  i {
    ${inline()};
    text-align: center;
    padding-right: 10px;
  }
  span {
    ${inline()};
  }
`

export const PopupMsgMenu = styled.div`
  min-width: 300px;

  ${(p) => css`
    .${p.theme.ns}Tabs-link a {
      padding-top: 0 !important;
      padding-bottom: 5px !important;
    }
  `}
`

export const SearchInput = styled.div`
  ${inline()};
  ${({ theme: { ns } }) => css`
    .${ns}TreeSelect-arrow {
      display: none;
    }
    .${ns}TreeSelect-input {
      width: 0;
      display: none;
      border-width: 0 0 1px 0;
      border-radius: 0;
      transition: width 2s ease-in-out;
    }
    .${ns}TreeSelect-value {
      ${ellipsis()};
    }
    .${ns}Tree {
      width: 350px;
      margin-top: 6px;
      border-color: #dedede;
      border-radius: 2px;
    }
    .active {
      .${ns}TreeSelect-input {
        display: flex;
        width: 180px;
      }
    }
  `}
  .search-input {
    ${inline()};
  }
`
